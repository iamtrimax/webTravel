const asyncHandler = require("../middleware/asyncHandler");
const Tour = require("../models/tour.model");
const crypto = require("crypto");
const { handlebooking } = require("../Services/userService");
const nodeCache = require("node-cache");
require("dotenv").config();
const { vnpay, dateFormat } = require("../utils/VNPay");

const bookingCache = new nodeCache({ stdTTL: 600 });
const createPayment = asyncHandler(async (req, res) => {
  const email = req.user.email;
  // 🟢 Lấy IP thật (quan trọng!)
  const {
    bookingSlots,
    bookingDate,
    fullname,
    phone,
    address,
    specialRequire,
    tourId,
  } = req.body;
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
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
    .substring(0, 3)}`;
  const totalPrice =
    tour.discountPrice * bookingSlots || tour.price * bookingSlots;
  // Thử in ra globalConfig để kiểm tra Secret Key
  console.log("Global Config:", vnpay.globalConfig);

  const paymentUrl = vnpay.buildPaymentUrl({
    vnp_Version: "2.1.0",
    vnp_Amount: totalPrice,
    vnp_TxnRef: idBooking,
    vnp_OrderInfo: `Thanh toan don hang #${idBooking}`,
    vnp_ReturnUrl: process.env.VNP_RETURNURL,
    vnp_BankCode: "NCB",
    vnp_CreateDate: dateFormat(now),
    vnp_ExpireDate: dateFormat(new Date(now.getTime() + 10 * 60 * 1000)),
    vnp_IpAddr: "127.0.0.1",
  });
  console.log("✅ Generated URL:", paymentUrl);
  console.log("🔑 Secret Key:", process.env.VNP_HASHSECRET);
  // Lưu booking vào cache
  bookingCache.set(idBooking, {
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
    data: paymentUrl,
    bookingData: bookingCache.get(idBooking.toString()),
  });
});

const vnpayReturn = async (req, res) => {
  const verify = vnpay.verifyReturnUrl(req.query);

  console.log("verify.....", verify);

  if (!verify.isVerified) {
    return res.redirect("http://localhost:5173/booking?status=invalid");
  }

  if (req.query.vnp_ResponseCode === "00") {
    // ✅ Thành công
    return res.redirect("http://localhost:5173/booking?status=success");
  } else {
    // ❌ Thất bại / hủy
    return res.redirect("http://localhost:5173/booking?status=failed");
  }
};
const vnpayIpn = async (req, res) => {
  try {
    console.log("IPN chay............");

    const verify = vnpay.verifyIpnCall(req.query);
    if (!verify.isVerified) {
      return res
        .status(400)
        .json({ RspCode: "97", Message: "Invalid signature" });
    }

    const responseCode = req.query.vnp_ResponseCode;
    const idBooking = req.query.vnp_TxnRef;
    const bookingData = bookingCache.get(idBooking);

    if (!bookingData) {
      return res
        .status(400)
        .json({ RspCode: "01", Message: "Booking not found in cache" });
    }

    if (responseCode === "00") {
      console.log("✅ IPN: Thanh toán thành công đơn hàng:", idBooking);

      try {
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

        bookingCache.del(idBooking);
        return res
          .status(200)
          .json({ RspCode: "00", data: booking, Message: "Success" });
      } catch (err) {
        console.error("DB error:", err);
        return res.status(500).json({ RspCode: "99", Message: "DB error" });
      }
    }

    return res
      .status(200)
      .json({ RspCode: "00", Message: "Payment not completed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ RspCode: "99", Message: "Lỗi xử lý" });
  }
};

module.exports = { createPayment, vnpayReturn, vnpayIpn };
