const asyncHandler = require("../middleware/asyncHandler");
const Tour = require("../models/tour.model");
const bookingModel = require("../models/booking.model");
const { mailUpdateStartDate } = require("../utils/email.utils");

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

  if (
    !title ||
    !description ||
    !price ||
    !duration ||
    !totalSlots ||
    !destination
  ) {
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

const updateTour = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const updatedData = req.body;

  // 1️⃣ Lấy tour cũ để so sánh
  const oldTour = await Tour.findById(tourId);
  if (!oldTour) {
    res.status(404);
    throw new Error("Tour không tồn tại");
  }

  // 2️⃣ Cập nhật tour
  const tour = await Tour.findByIdAndUpdate(tourId, updatedData, { new: true });

  // 3️⃣ Nếu có thay đổi startDates thì xử lý
  if (updatedData.startDates && Array.isArray(updatedData.startDates)) {
    const oldDates = oldTour.startDates.map((d) => new Date(d).toISOString());
    const newDates = updatedData.startDates.map((d) =>
      new Date(d).toISOString()
    );

    // Tìm những ngày bị xóa hoặc đổi
    const removedDates = oldDates.filter((d) => !newDates.includes(d));

    if (removedDates.length > 0) {
      console.log("Các ngày khởi hành bị thay đổi:", removedDates);

      // 4️⃣ Tìm các booking bị ảnh hưởng
      const affectedBookings = await bookingModel.find({
        tour: tourId,
        bookingDate: { $in: removedDates },
        bookingStatus: { $ne: "cancelled" },
      });

      // 5️⃣ Gửi email thông báo cho khách
      try {
        await Promise.all(
          affectedBookings.map(async (booking) => {
            // ✅ Cập nhật trạng thái booking
            booking.bookingStatus = "pending";
            booking.adminMessage = `Tour đã thay đổi ngày khởi hành từ ${new Date(
              booking.bookingDate
            ).toLocaleDateString("vi-VN")}`;
            await booking.save();

            // Gửi email (không cần chờ từng cái)
            await mailUpdateStartDate(tour, booking);
          })
        );
      } catch (error) {
        console.error("Lỗi gửi mail cho", booking.email, error.message);
      }
    }
  }

  // 6️⃣ Trả về kết quả
  res.status(200).json({
    message: "Cập nhật tour thành công",
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
  return res.status(200).json({ success: true, error: false, data: tour });
});
const getTourDetail = asyncHandler(async (req, res) => {
  const tourId = req.params.id;

  const tour = await Tour.findById(tourId).populate(
    "rating.details.userId",
    "username"
  );
  if (!tour) {
    throw new Error("không tìm thấy tour");
  }
  return res.status(200).json({
    data: tour,
    success: true,
    error: false,
  });
});
const addReview = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  if (!tour) throw new Error("Không tìm thấy tour");
  const user = req.userId;
  const { rating, comment } = req.body;
  tour["addRating"](user, rating, comment || "");
  await tour.save();
  res.status(200).json({
    data: tour,
    success: true,
    error: false,
  });
});
const getAllReview = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId)
    .populate("rating.details.userId", "username")
    .select("rating.details rating.average rating.count details.createdAt");
  if (!tour) throw new Error("không tồn tại tour này");
  res.status(200).json({
    data: tour,
    summary: {
      averageRating: tour.rating.average,
      totalRatings: tour.rating.count,
    },
    success: true,
    error: false,
  });
});
const deleteReview = asyncHandler(async (req, res) => {
  const tourId = req.params.id;
  const userId = req.params.userId;
  const tour = await Tour.findById(tourId);
  if (!tour) throw new Error("Không tìm thấy tour");
  tour["removeRating"](userId);
  await tour.save();
  res.status(200).json({
    data: tour,
    success: true,
    error: false,
  });
});
const autoChangeActive = async () => {
  const tours = await Tour.find();

  for (const tour of tours) {
    // Kiểm tra xem có ít nhất 1 ngày khởi hành trong tương lai không
    const hasFutureStartDate = tour.startDates.some(
      (date) => new Date(date) > new Date()
    );

    // Nếu KHÔNG có ngày khởi hành tương lai => tắt tour
    if (!hasFutureStartDate && tour.isActive === true) {
      tour.isActive = false;
      await tour.save();
      console.log(`Tour ${tour.title} đã được tắt (hết ngày khởi hành).`);
    }
  }
};
const getTourFeature = asyncHandler(async (req, res) => {
  const tour = await Tour.getTopRated(10);
  console.log(tour);
  
  res.status(200).json({
    data: tour,
    success: true,
    error: false,
  });
});
module.exports = {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  toggleTourStatus,
  getTourDetail,
  addReview,
  getAllReview,
  deleteReview,
  autoChangeActive,
  getTourFeature,
};
