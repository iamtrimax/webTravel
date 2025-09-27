const asyncHandler = require("../middleware/asyncHandler");
const Tour = require("../models/tour.model");

// Tạo tour
const createTour = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    destination,
    meetingPoint,
    price,
    discountPrice,
    duration,
    bookedSlots,
    itinerary,
    images,
    inclusions,
    exclusions,
    startDates,
    totalSlots,
    category,
    tags,
    isActive,
  } = req.body;

  if (!title || !description || !price || !duration || !totalSlots || !destination) {
    res.status(400);
    throw new Error("Thiếu thông tin bắt buộc");
  }

  const tour = new Tour({
    title,
    description,
    price,
    discountPrice,
    destination,
    meetingPoint,
    duration,
    itinerary,
    bookedSlots,
    images,
    inclusions,
    exclusions,
    startDates,
    totalSlots,
    category,
    tags,
    isActive,
  });

  await tour.save();

  res.status(201).json({
    message: "Thêm tour thành công",
    error: false,
    success: true,
    data: tour,
  });
});

// Lấy tất cả tour
const getAllTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).json({
    message: "Lấy danh sách tour thành công",
    error: false,
    success: true,
    data: tours,
  });
});

// Cập nhật tour
const updateTour = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const updatedData = req.body;

  const tour = await Tour.findByIdAndUpdate(tourId, updatedData, { new: true });
  if (!tour) {
    res.status(404);
    throw new Error("Tour không tồn tại");
  }

  res.status(200).json({
    message: "Cập nhật tour thành công",
    error: false,
    success: true,
    data: tour,
  });
});
const deleteTour = asyncHandler(async (req, res) => {
  const tourId = req.params.id; 
  const tour = await Tour.findByIdAndDelete(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Tour không tồn tại");
  }
  return res.status(200).json({
    message: "Xoá tour thành công",
    error: false,
    success: true,
  });
});
const toggleTourStatus = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    res.status(404);
    throw new Error("Tour không tồn tại");
  } 
  tour.isActive = !tour.isActive;
  await tour.save();
  return res.status(200).json({success: true, error: false, data: tour });
});

module.exports = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  toggleTourStatus
};
