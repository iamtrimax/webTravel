const asyncHandler = require("../middleware/asyncHandler");
const bookingModel = require("../models/booking.model");
const Tour = require("../models/tour.model");
const crypto = require("crypto");
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
  const crypto = require("crypto");
  const idBooking = `bk${crypto
    .randomBytes(2)
    .toString("hex")
    .substring(0, 3)}`;
  const totalPrice =
    tour.discountPrice * bookingSlots || tour.price * bookingSlots;

  const newBooking = new bookingModel({
    idBooking,
    bookingSlots,
    bookingDate,
    totalPrice,
    fullname,
    email,
    phone,
    address,
    specialRequire,
    tour: tour._id, // 🔥 lưu reference tới tour
  });

  let booking = await newBooking.save();
  booking = await booking.populate("tour", "title price destination"); // 🔥 populate tour

  tour.bookedSlots += bookingSlots;
  await tour.save();

  res.status(201).json({
    success: true,
    message: "Đặt tour thành công",
    error: false,
    data: booking,
  });
});
const getAllBooking = asyncHandler(async (req, res) => {
  const booking = await bookingModel.find().populate("tour", "title");
  return res.status(200).json({
    data: booking,
    success: true,
    error: false,
  });
});
module.exports = {
  createBooking,
  getAllBooking,
};
