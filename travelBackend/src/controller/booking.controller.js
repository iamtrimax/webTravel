const asyncHandler = require("../middleware/asyncHandler");
const bookingModel = require("../models/booking.model");
const Tour = require("../models/tour.model");
const crypto = require("crypto");
const {
  handlebooking,
  changeStatusBookingService,
  changePayStatusService,
  cancelBookingService,
  autoCancelBookingService,
} = require("../Services/userService");
const createBooking = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const {
    tourId,
    bookingSlots,
    bookingDate,
    fullname,
    phone,
    address,
    specialRequire,
  } = req.body;

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

  const handleBooking = await handlebooking(
    idBooking,
    bookingSlots,
    bookingDate,
    totalPrice,
    fullname,
    email,
    phone,
    address,
    specialRequire,
    tour,
    payStatus = "pending"
  );
  return res.status(201).json({
    success: true,
    message: "Đặt tour thành công",
    error: false,
    data: handleBooking,
  });
});
const getAllBooking = asyncHandler(async (req, res) => {
  const booking = await bookingModel
    .find()
    .populate("tour", "title")
    .sort({ createdAt: -1 })
    .lean();
  return res.status(200).json({
    data: booking,
    success: true,
    error: false,
  });
});
const changeStatusBooking = asyncHandler(async (req, res) => {
  const idBooking = req.params.id;
  const newStatus = req.query.newstatus;
  const booking = await bookingModel.findById(idBooking);

  if (!booking) throw new Error("Không có trong hệ thống");
  await changeStatusBookingService(booking, newStatus);

  return res.status(200).json({
    message: "Đã xác nhận đặt chỗ",
    success: true,
    error: false,
  });
});
const getBookingByAccount = asyncHandler(async (req, res) => {
  const email = req.user.email;
  const booking = await bookingModel
    .find({ email })
    .populate("tour", "title meetingPoint images inclusions rating")
    .lean().sort({createdAt: -1});
  return res.status(200).json({
    data: booking,
    success: true,
    error: false,
  });
});
const cancelBooking = asyncHandler(async (req, res) => {
  const idBooking = req.params.id;
  const booking = await bookingModel.findById(idBooking);
  if (!booking) {
    res.status(404);
    throw new Error("Không tìm thấy đặt chỗ");
  }
  await cancelBookingService(booking);
  return res.status(200).json({
    message: "Vé đã huỷ",
    success: true,
    error: false,
  });
});
const changePayStatus = asyncHandler(async (req, res) => {
  const idBooking = req.params.id;
  const { status } = req.body;
  const booking = await bookingModel.findById(idBooking);
  if (!booking) {
    res.status(404);
    throw new Error("Không tìm thấy đặt chỗ");
  }
  if (booking.payStatus === "paid") {
    res.status(400);
    throw new Error("Vé đã được thanh toán");
  }
  booking.payStatus = status;
  await booking.save();
  return res.status(200).json({
    message: "Thanh toán thành công",
    success: true,
    error: false,
  });
});
const autoCancelBooking = asyncHandler(async () => {
  const now = new Date();

  const pendingPayStatus = await bookingModel.find({
    payStatus: "pending",
    bookingStatus: { $ne: "cancelled" },
  });
  if(pendingPayStatus.length ===0){
    return;
  }
  for (const booking of pendingPayStatus) {
    // booking.bookingDate đã là Date → clone ra để không bị mutate
    const bookingDate = new Date(booking.bookingDate);

    // Gán giờ khởi hành 7:30 sáng theo giờ Việt Nam
    bookingDate.setHours(7, 30, 0, 0);

    // Giờ giới hạn thanh toán: trước 1 tiếng
    const deadline = new Date(bookingDate.getTime() - 60 * 60 * 1000);

    if (now > deadline) {
      await autoCancelBookingService(booking);
      console.log(`✅ Huỷ vé ${booking.idBooking}`);
    }
  }
});


module.exports = {
  createBooking,
  getAllBooking,
  changeStatusBooking,
  getBookingByAccount,
  cancelBooking,
  changePayStatus,
  autoCancelBooking,
};
