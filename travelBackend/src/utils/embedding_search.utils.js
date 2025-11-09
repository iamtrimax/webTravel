const Tour = require("../models/tour.model");

const companyInfo = {
  name: "Travel",
  phone: "0397961994",
  email: "trimax2k3@gmail.com",
  address: "17 Abc, Thủ Đức, HCM",
  policies: {
    cancellation:
      "Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn",
    payment:
      "Quý khách chọn thanh toán tiền mặt vui lòng thanh toán trước 7 ngày khởi hành",
    payment_methods: [
      "💵 Tiền mặt: Thanh toán trực tiếp tại văn phòng",
      "🏦 thanh toán online: một số ngân hàng có hỗ trợ",
    ],
  },
};

// Sửa: Thêm async và await
const searchTours = async (query) => {
  try {
    const lowercaseQuery = query.toLowerCase();
    console.log(`🔍 Search query: "${query}" -> "${lowercaseQuery}"`);

    // Tạo mảng điều kiện tìm kiếm
    const searchConditions = [];

    // Tìm kiếm cơ bản
    const basicSearchFields = ['title', 'destination', 'description', 'category'];
    basicSearchFields.forEach(field => {
      searchConditions.push({ [field]: { $regex: lowercaseQuery, $options: 'i' } });
    });

    // Tìm kiếm theo tags
    searchConditions.push({ tags: { $in: [new RegExp(lowercaseQuery, 'i')] } });

    // Tìm kiếm theo từ khóa đặc biệt
    if (lowercaseQuery.includes('đà nẵng') || lowercaseQuery.includes('da nang')) {
      searchConditions.push({ 
        $or: [
          { destination: { $regex: 'đà nẵng', $options: 'i' } },
          { title: { $regex: 'đà nẵng', $options: 'i' } }
        ]
      });
    }

    if (lowercaseQuery.includes('phú quốc') || lowercaseQuery.includes('phu quoc')) {
      searchConditions.push({ 
        $or: [
          { destination: { $regex: 'phú quốc', $options: 'i' } },
          { title: { $regex: 'phú quốc', $options: 'i' } }
        ]
      });
    }

    if (lowercaseQuery.includes('nội địa') || lowercaseQuery.includes('trong nước')) {
      searchConditions.push({ category: { $regex: 'nội địa', $options: 'i' } });
    }

    if (lowercaseQuery.includes('quốc tế') || lowercaseQuery.includes('nước ngoài')) {
      searchConditions.push({ category: { $regex: 'quốc tế', $options: 'i' } });
    }

    // Tìm kiếm theo giá
    if (lowercaseQuery.includes('giá') || lowercaseQuery.includes('gia')) {
      // Tìm tất cả tour có giá
      searchConditions.push({ price: { $exists: true, $ne: null } });
    }

    if (lowercaseQuery.includes('rẻ') || lowercaseQuery.includes('re')) {
      // Tìm tour có giá dưới 5 triệu
      searchConditions.push({ 
        $or: [
          { price: { $lte: 5000000 } },
          { discountPrice: { $lte: 5000000 } }
        ]
      });
    }

    // Tìm kiếm theo số (giá)
    const priceMatch = lowercaseQuery.match(/(\d+)\s*(triệu|tr|k|nghìn|vnd)/);
    if (priceMatch) {
      const amount = parseInt(priceMatch[1]);
      let minPrice = 0, maxPrice = 0;

      if (priceMatch[2].includes('triệu') || priceMatch[2].includes('tr')) {
        minPrice = amount * 1000000;
        maxPrice = (amount + 2) * 1000000;
      } else if (priceMatch[2].includes('k') || priceMatch[2].includes('nghìn')) {
        minPrice = amount * 1000;
        maxPrice = (amount + 500) * 1000;
      }

      if (minPrice > 0) {
        searchConditions.push({
          $or: [
            { price: { $gte: minPrice, $lte: maxPrice } },
            { discountPrice: { $gte: minPrice, $lte: maxPrice } }
          ]
        });
      }
    }

    console.log('📋 Search conditions:', JSON.stringify(searchConditions, null, 2));

    // Thực hiện tìm kiếm
    const tourData = await Tour.find({
      $or: searchConditions
    })

    console.log(`✅ Tìm thấy ${tourData.length} tour`);
    
    // Debug chi tiết kết quả tìm được
    if (tourData.length > 0) {
      console.log('📝 Tour tìm được:');
      tourData.forEach((tour, index) => {
        console.log(`  ${index + 1}. ${tour.title} - ${tour.destination} - ${tour.price} VND`);
      });
    } else {
      console.log('❌ Không tìm thấy tour nào, thử tìm tất cả tour...');
      
      // Thử tìm tất cả tour để kiểm tra
      const allTours = await Tour.find().limit(5).lean();
      console.log(`📊 Có ${allTours.length} tour trong database:`);
      allTours.forEach((tour, index) => {
        console.log(`  ${index + 1}. ${tour.title} - ${tour.destination}`);
      });
    }

    return tourData;

  } catch (error) {
    console.error('❌ Error searching tours:', error);
    return [];
  }
};
// Sửa: Đổi tên hàm cho đúng
const searchCompanyInfo = (query) => {
  const lowercaseQuery = query.toLowerCase();
  const info = [];

  if (lowercaseQuery.includes("hủy") || lowercaseQuery.includes("hủy tour")) {
    info.push(companyInfo.policies.cancellation);
  }

  if (
    lowercaseQuery.includes("thanh toán") ||
    lowercaseQuery.includes("tiền mặt") ||
    lowercaseQuery.includes("thanh toán online")
  ) {
    info.push(companyInfo.policies.payment);
  }

  if (
    lowercaseQuery.includes("phương thức thanh toán") ||
    lowercaseQuery.includes("cách thanh toán") ||
    lowercaseQuery.includes("hình thức thanh toán")
  ) {
    info.push("Các phương thức thanh toán:");
    companyInfo.policies.payment_methods.forEach((method) => {
      info.push(`- ${method}`);
    });
  }

  if (
    lowercaseQuery.includes("liên hệ") ||
    lowercaseQuery.includes("số điện thoại") ||
    lowercaseQuery.includes("hotline") ||
    lowercaseQuery.includes("email")
  ) {
    info.push(`Hotline: ${companyInfo.phone}, Email: ${companyInfo.email}`);
  }

  if (
    lowercaseQuery.includes("địa chỉ") ||
    lowercaseQuery.includes("công ty")
  ) {
    info.push(`Địa chỉ: ${companyInfo.address}`);
  }

  return info;
};

// Hàm search tổng hợp
// Hàm search tổng hợp với debug chi tiết
const searchRelevantData = async (query) => {
  console.log(`🎯 Đang tìm kiếm: "${query}"`);

  const results = {
    tours: [],
    policies: [],
    companyInfo: [],
  };

  // Search tours từ database
  results.tours = await searchTours(query);
  console.log(`📊 Tìm thấy ${results.tours.length} tour`);

  // Search company info
  const companyResults = searchCompanyInfo(query);
  console.log(`📋 Kết quả tìm kiếm company info:`, companyResults);

  results.policies = companyResults.filter(
    (item) =>
      item.includes("Hủy") ||
      item.includes("thanh toán") ||
      item.includes("hoàn")
  );
  results.companyInfo = companyResults.filter(
    (item) =>
      item.includes("Hotline") ||
      item.includes("Địa chỉ") ||
      item.includes("Email")
  );

  console.log("📦 Kết quả tổng hợp:", {
    tours: results.tours.length,
    policies: results.policies,
    companyInfo: results.companyInfo,
  });

  return results;
};

const formatContextForAI = (relevantData) => {
  let context = "THÔNG TIN CÔNG TY VÀ DỮ LIỆU TOUR:\n\n";

  // Company info
  context += "=== THÔNG TIN CÔNG TY ===\n";
  context += `Tên: ${companyInfo.name}\n`;
  context += `Hotline: ${companyInfo.phone}\n`;
  context += `Email: ${companyInfo.email}\n`;
  context += `Địa chỉ: ${companyInfo.address}\n`;
  context += `Dịch vụ: Tour du lịch, Bảo hiểm\n\n`;

  // Relevant tours
  if (relevantData.tours.length > 0) {
    context += "=== TOUR LIÊN QUAN ===\n";
    relevantData.tours.forEach((tour, index) => {
      context += `TOUR ${index + 1}:\n`;
      context += `- Tên: ${tour.title}\n`;
      context += `- Điểm đến: ${tour.destination}\n`;
      context += `- Thời gian: ${tour.duration || "Không xác định"}\n`;
      context += `- Giá gốc: ${
        tour.price ? tour.price.toLocaleString() + " VND" : "Liên hệ"
      }\n`;

      // Thêm giá discount nếu có - SỬA LỖI Ở ĐÂY
      if (tour.discountPrice && tour.discountPrice > 0) {
        context += `- Giá khuyến mãi: ${tour.discountPrice.toLocaleString()} VND\n`;
      }

      context += `- Mô tả: ${tour.description}\n`;

      // Thêm tags nếu có
      if (tour.tags && tour.tags.length > 0) {
        context += `- Thẻ: ${tour.tags.join(", ")}\n`;
      }

      // Thêm category - QUAN TRỌNG: hiển thị category
      context += `- Danh mục: ${tour.category || "Không xác định"}\n`;

      // Thêm startDates nếu có
      if (tour.startDates && tour.startDates.length > 0) {
        const dates = tour.startDates.map((date) =>
          new Date(date).toLocaleDateString("vi-VN")
        );
        context += `- Ngày khởi hành: ${dates.join(", ")}\n`;
      }

      context += `- Số chỗ còn lại: ${
        tour.availableSlots || "Không xác định"
      }\n\n`;
    });
  }

  // Policies - SỬA LỖI: dùng relevantData.policies thay vì relevantData.companyInfo.policies
  if (relevantData.policies.length > 0) {
    context += "=== CHÍNH SÁCH ===\n";
    relevantData.policies.forEach((policy) => {
      // SỬA: relevantData.policies
      context += `- ${policy}\n`;
    });
    context += "\n";
  }

  // Company contact info
  if (relevantData.companyInfo.length > 0) {
    context += "=== THÔNG TIN LIÊN HỆ ===\n";
    relevantData.companyInfo.forEach((info) => {
      context += `- ${info}\n`;
    });
    context += "\n";
  }

  return context;
};

module.exports = {
  searchRelevantData,
  formatContextForAI,
  searchTours,
  searchCompanyInfo,
  companyInfo,
};
