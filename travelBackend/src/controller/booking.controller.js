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
    payStatus = "pending",
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

  // chỉ lấy những tour sắp hết hạn thanh toán
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  const pendingPayStatus = await bookingModel.find({
    payStatus: "pending",
    bookingStatus: { $ne: "cancelled" },
    bookingDate: {$lte: sevenDaysAgo}
  });
  if(pendingPayStatus.length ===0){
    return;
  }
  for (const booking of pendingPayStatus) {
    // booking.bookingDate đã là Date → clone ra để không bị mutate
    const bookingDate = new Date(booking.bookingDate);

    //không thanh toán trước 7 ngày huỷ
    const deadline = new Date(bookingDate);
    deadline.setDate(bookingDate.getDate() - 7)
    deadline.setHours(23, 59, 59, 999)

    if (now > deadline) {
      await autoCancelBookingService(booking);
      console.log(`✅ Huỷ vé ${booking.idBooking}`);
    }
  }
});

const getDailyRevenue = asyncHandler(async (req, res) => {
    // 1. Xác định phạm vi thời gian (từ 00:00:00 đến 23:59:59 hôm nay)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Đặt về 00:00:00.000

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Đặt về 23:59:59.999

    
        // 2. Sử dụng Aggregation để lọc và tính tổng
        const revenueResult = await bookingModel.aggregate([
            {
                // Bước 1: Lọc các đơn hàng thành công trong ngày hôm nay
                $match: {
                    // Giả định bạn có trường 'isPaid' hoặc 'status' để lọc đơn hàng thành công
                    payStatus:"paid",
                    bookingStatus:{$ne:"cancelled"}, 
                    createdAt: {
                        $gte: startOfToday,
                        $lte: endOfToday
                    }
                }
            },
            {
                // Bước 2: Tính tổng doanh thu
                $group: {
                    _id: null, // Nhóm tất cả kết quả thành một
                    totalRevenue: { $sum: '$totalPrice' } // Tính tổng trường totalAmount
                }
            }
        ]);

        // Xử lý kết quả trả về
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            message: "Lấy doanh thu hôm nay thành công",
            data: {
                totalRevenue: totalRevenue
            }
        });
});
const getDailyBookingCount = asyncHandler(async (req, res) => {
    // 1. Xác định phạm vi thời gian
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); 

    // 2. Sử dụng Aggregation để lọc và đếm số lượng
    const bookingCountResult = await bookingModel.aggregate([
        {
            $match: {
                // Lọc các đơn hàng đã thanh toán và chưa bị hủy
                payStatus: "paid",
                bookingStatus: { $ne: "cancelled" }, 
                createdAt: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            }
        },
        {
            // Đếm tổng số tài liệu (bookings)
            $group: {
                _id: null,
                totalBookings: { $sum: 1 } 
            }
        }
    ]);

    // 3. Xử lý kết quả trả về
    const totalBookings = bookingCountResult.length > 0 ? bookingCountResult[0].totalBookings : 0;

    res.status(200).json({
        success: true,
        message: "Lấy tổng số lượt đặt tour hôm nay thành công",
        data: {
            totalBookings: totalBookings
        }
    });
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
    // Lấy doanh thu trong 12 tháng gần nhất (có thể điều chỉnh)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenue = await bookingModel.aggregate([
        {
            // Bước 1: Lọc các giao dịch hợp lệ (đã thanh toán, không hủy) và giới hạn thời gian
            $match: {
                payStatus: "paid",
                bookingStatus: { $ne: "cancelled" }, 
                createdAt: { $gte: twelveMonthsAgo } // Lấy 12 tháng gần nhất
            }
        },
        {
            // Bước 2: Nhóm và tính toán
            $group: {
                // Nhóm theo Năm và Tháng
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                // Tính tổng doanh thu
                totalRevenue: { $sum: '$totalPrice' },
                // Đếm tổng số đơn hàng
                totalBookings: { $sum: 1 } 
            }
        },
        {
            // Bước 3: Sắp xếp theo Năm và Tháng để hiển thị biểu đồ đúng thứ tự
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            // Bước 4: Định dạng lại output cho dễ đọc hơn
            $project: {
                _id: 0, // Bỏ trường _id mặc định
                month: "$_id.month",
                year: "$_id.year",
                label: { 
                    $concat: [
                        { $toString: "$_id.month" }, 
                        "/", 
                        { $toString: "$_id.year" } 
                    ] 
                },
                totalRevenue: 1,
                totalBookings: 1
            }
        }
    ]);
    console.log(monthlyRevenue);
    
    res.status(200).json({
        success: true,
        message: "Lấy doanh thu theo tháng thành công",
        data: monthlyRevenue
    });
});
const getDailyBookings = asyncHandler(async (req, res) => {
    // 1. Xác định phạm vi thời gian (30 ngày gần nhất)
    const thirtyDaysAgo = new Date();
    // Quay lại 30 ngày
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); 
    thirtyDaysAgo.setHours(0, 0, 0, 0); // Bắt đầu từ 00:00:00 của ngày đó

    const dailyBookings = await bookingModel.aggregate([
        {
            // Bước 1: Lọc các đơn hàng hợp lệ (đã thanh toán, không hủy) và giới hạn thời gian
            $match: {
                payStatus: "paid",
                bookingStatus: { $ne: "cancelled" }, 
                createdAt: { $gte: thirtyDaysAgo } // Lấy 30 ngày gần nhất
            }
        },
        {
            // Bước 2: Nhóm và tính toán
            $group: {
                // Nhóm theo Ngày, Tháng và Năm
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                },
                // Đếm tổng số lượt đặt tour
                totalBookings: { $sum: 1 } 
            }
        },
        {
            // Bước 3: Sắp xếp theo thứ tự thời gian tăng dần
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
                "_id.day": 1
            }
        },
        {
            // Bước 4: Định dạng lại output cho dễ đọc hơn
            $project: {
                _id: 0, 
                day: "$_id.day",
                month: "$_id.month",
                year: "$_id.year",
                // Tạo label dạng DD/MM
                label: { 
                    $concat: [
                        { $toString: "$_id.day" }, 
                        "/", 
                        { $toString: "$_id.month" } 
                    ] 
                },
                totalBookings: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        message: "Lấy lượt đặt tour theo ngày thành công",
        data: dailyBookings
    });
});
module.exports = {
  createBooking,
  getAllBooking,
  changeStatusBooking,
  getBookingByAccount,
  cancelBooking,
  changePayStatus,
  autoCancelBooking,
  getDailyRevenue,
  getDailyBookingCount,
  getMonthlyRevenue,
  getDailyBookings
};
