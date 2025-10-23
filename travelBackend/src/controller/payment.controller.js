const asyncHandler = require("../middleware/asyncHandler");
const { PayOS } = require("@payos/node");
const Tour = require("../models/tour.model");
const crypto = require("crypto");
const { handlebooking } = require("../Services/userService");
const nodeCache = require("node-cache");
const { data } = require("react-router-dom");
require("dotenv").config();

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const bookingCache = new nodeCache({ stdTTL: 600 });
const webhookProcessed = new Set()
const createPayOSLink = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const {
    bookingSlots,
    bookingDate,
    fullname,
    phone,
    address,
    specialRequire,
    tourId,
  } = req.body;
  console.log('slotttttt',bookingSlots);
  
  const tour = await Tour.findById(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Tour không tồn tại");
  }
  if (tour.availableSlots < bookingSlots) {
    res.status(400);
    throw new Error("Không đủ chỗ!");
  }
  const idBooking = `bk${crypto
    .randomBytes(2)
    .toString("hex")
    .substring(0, 3)}`; // orderCode PayOS bắt buộc là số
  const orderCode = Math.floor(100000 + Math.random() * 900000);

  const totalPrice =
    tour.discountPrice * bookingSlots || tour.price * bookingSlots;

  const body = {
    orderCode,
    amount: totalPrice,
    description: `${idBooking}`,
    returnUrl: `${process.env.FRONTEND_URL}/booking`,
    cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
    items: [
      {
        name: tour.title,
        quantity: bookingSlots,
        price: totalPrice,
      },
    ],
    expired_at: new Date(Date.now() + 10 * 60 * 1000),
  };

  const paymentLink = await payos.paymentRequests.create(body);
  console.log(paymentLink);

  // Lưu booking vào DB
  bookingCache.set(orderCode.toString(), {
    idBooking,
    bookingSlots,
    bookingDate,
    totalPrice,
    fullname,
    email,
    phone,
    address,
    specialRequire,
    tour: tour.toObject(),
  });

  return res.status(200).json({
    success: true,
    data: paymentLink.checkoutUrl,
    bookingData: bookingCache.get(orderCode.toString()) 
  });
});

const paymentPayOSWebhook = asyncHandler(async (req, res) => {
  console.log("🔔 WEBHOOK NHẬN ĐƯỢC");
  console.log("Body:", JSON.stringify(req.body, null, 2));

  // 1. KIỂM TRA CÓ PHẢI WEBHOOK TEST KHÔNG
  const { data, code, desc } = req.body;

  // PayOS test webhook có orderCode = 123 và description = "VQRIO123"
  if (data && data.orderCode === 123 && data.description === "VQRIO123") {
    return res.status(200).json({
      success: true,
      message: "Webhook test thành công",
      test: true,
    });
  }

  // 2. XỬ LÝ WEBHOOK THẬT
  if (!data) throw new Error("thiếu dữ liệu");

  const { orderCode } = data;
  const paymentStatus = data.desc; // "Thành công" hoặc thông báo khác
  const webhookSignature = req.headers["x-payos-signature"];
  const webhookId = `${orderCode}_${webhookSignature}`;

  if (webhookProcessed.has(webhookId)) {
    return res.status(200).json({
      success: true,
      message: "Webhook đã được xử lý",
    });
  }

  if (paymentStatus === "success") {
    const bookingData = bookingCache.get(orderCode.toString());
    if (!bookingData) {
      throw new Error("không tìm thấy hoá đơn thanh toans");
    }
    console.log("bookingSlot,......", typeof bookingData.bookingSlots);
    
    // Xử lý booking thành công
    const booking = await handlebooking(
      bookingData.idBooking,
      bookingData.bookingSlots,
      bookingData.bookingDate,
      bookingData.totalPrice,
      bookingData.fullname,
      bookingData.email,
      bookingData.phone,
      bookingData.address,
      bookingData.specialRequire,
      bookingData.tour,
      "paid"
    );

    // Xóa cache sau khi xử lý
    bookingCache.del(orderCode.toString());

    return res.status(200).json({
      success: true,
      data: booking,
      error: false,
    });
  } else {
    // Thanh toán thất bại hoặc bị hủy
    bookingCache.del(orderCode.toString());

    throw new Error(`thanh toán thất bại ${paymentStatus}`);
  }
});
module.exports = { createPayOSLink, paymentPayOSWebhook };
