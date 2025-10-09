const asyncHandler = require("../middleware/asyncHandler");
const bookingModel = require("../models/booking.model");
const Tour = require("../models/tour.model");
const crypto = require("crypto");
const { handlebooking, changeStatusBookingService } = require("../Services/userService");
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

  const handleBooking = await handlebooking(idBooking, bookingSlots, bookingDate, totalPrice, fullname, email, phone, address, specialRequire, tour)
  return res.status(201).json({
    success: true,
    message: "Đặt tour thành công",
    error: false,
    data: handleBooking,
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
const changeStatusBooking = asyncHandler(async(req,res)=>{
  const idBooking =  req.params.id
  const newStatus = req.query.newstatus
  const booking = await bookingModel.findById(idBooking)

  if(!booking)
    throw new Error("Không có trong hệ thống")
  await changeStatusBookingService(booking, newStatus)

  return res.status(200).json({
    message:"Đã xác nhận đặt chỗ",
    success:true,
    error:false
  })

})
const getBookingByAccount = asyncHandler(async(req, res)=>{
  const email = req.user.email
  const booking = await bookingModel.find({email}).populate("tour","title meetingPoint images inclusions rating").lean()
  console.log(booking);
  
  return res.status(200).json({
    data: booking,
    success: true,
    error: false
  })

})
module.exports = {
  createBooking,
  getAllBooking,
  changeStatusBooking,
  getBookingByAccount
};
