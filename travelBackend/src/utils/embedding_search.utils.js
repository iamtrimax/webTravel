const Tour = require("../models/tour.model"); // Đảm bảo đường dẫn này là đúng

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
      "🏦 Thanh toán online: một số ngân hàng có hỗ trợ",
    ],
  },
};

// Sửa: Thêm async và await
const searchTours = async (query) => {
  try {
    const lowercaseQuery = query.toLowerCase().trim();
    console.log(`🔍 Search query: "${query}" -> "${lowercaseQuery}"`);

    // Mảng để chứa các nhóm điều kiện (Text conditions, Price conditions)
    const combinedConditions = [];

    // --- 1. Nhóm điều kiện tìm kiếm VĂN BẢN/TỪ KHÓA ---
    const textConditions = [];
    const basicSearchFields = ['title', 'destination', 'description', 'category'];

    // Tách từ khóa và tạo điều kiện tìm kiếm linh hoạt hơn
    // Chỉ tìm kiếm các từ có độ dài >= 2
    const keywords = lowercaseQuery.split(/\s+/).filter(word => word.length >= 2);
    
    // Nếu có từ khóa, tạo điều kiện $or cho các trường
    if (keywords.length > 0) {
        keywords.forEach(keyword => {
            // Điều kiện cho mỗi từ khóa phải khớp với ÍT NHẤT 1 trường văn bản HOẶC tags
            const keywordOrConditions = basicSearchFields.map(field => ({
                [field]: { $regex: keyword, $options: 'i' }
            }));
            // Thêm điều kiện tags
            keywordOrConditions.push({ tags: { $in: [new RegExp(keyword, 'i')] } });

            // Gom tất cả các điều kiện $or của từ khóa này lại
            textConditions.push({ $or: keywordOrConditions });
        });
    } else {
        // Trường hợp người dùng chỉ gõ 1 từ hoặc chuỗi ngắn
        // Sử dụng tìm kiếm cơ bản cho toàn bộ truy vấn nếu không có keywords tách rời
         const keywordOrConditions = basicSearchFields.map(field => ({
            [field]: { $regex: lowercaseQuery, $options: 'i' }
        }));
        keywordOrConditions.push({ tags: { $in: [new RegExp(lowercaseQuery, 'i')] } });
        textConditions.push({ $or: keywordOrConditions });
    }
    
    if (textConditions.length > 0) {
        // Kết hợp các điều kiện từ khóa bằng $and (Tour phải chứa TẤT CẢ từ khóa)
        combinedConditions.push({ $and: textConditions });
    }
    

    // --- 2. Nhóm điều kiện tìm kiếm GIÁ ---
    const priceConditions = [];
    
    // Tìm kiếm theo từ khóa 'giá' hoặc 'rẻ'
    if (lowercaseQuery.includes('giá') || lowercaseQuery.includes('gia')) {
      // Tìm tất cả tour có giá
      priceConditions.push({ price: { $exists: true, $ne: null } });
    }

    if (lowercaseQuery.includes('rẻ') || lowercaseQuery.includes('re')) {
      // Tìm tour có giá dưới 5 triệu
      priceConditions.push({ 
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
        // Khoảng giá rộng hơn 
        maxPrice = (amount + 5) * 1000000; 
      } else if (priceMatch[2].includes('k') || priceMatch[2].includes('nghìn')) {
        minPrice = amount * 1000;
        maxPrice = (amount + 1000) * 1000;
      }

      if (minPrice > 0) {
        priceConditions.push({
          $or: [
            { price: { $gte: minPrice, $lte: maxPrice } },
            { discountPrice: { $gte: minPrice, $lte: maxPrice } }
          ]
        });
      }
    }
    
    if (priceConditions.length > 0) {
        // Gom tất cả các điều kiện giá bằng $or (Tour khớp với ÍT NHẤT 1 điều kiện giá)
        combinedConditions.push({ $or: priceConditions });
    }


    console.log('📋 Search conditions:', JSON.stringify(combinedConditions, null, 2));

    // --- 3. Thực hiện tìm kiếm TỔNG HỢP ---
    let tourData = [];
    
    if (combinedConditions.length === 2) {
        // Trường hợp người dùng nhập VĂN BẢN VÀ GIÁ (VD: "tour Hà Nội 5 triệu")
        // Ưu tiên tìm kiếm bằng $AND để kết quả chính xác hơn
        console.log('⭐ Thử tìm kiếm bằng $AND (Văn bản & Giá)...');
        tourData = await Tour.find({ $and: combinedConditions }).lean();

        // Nếu không tìm thấy, thử tìm kiếm bằng $OR
        if (tourData.length === 0) {
            console.log('⭐ Không tìm thấy, thử tìm kiếm bằng $OR (Văn bản hoặc Giá)...');
            tourData = await Tour.find({ $or: combinedConditions }).lean();
        }
    } else if (combinedConditions.length === 1) {
        // Trường hợp chỉ có VĂN BẢN hoặc chỉ có GIÁ
        console.log('⭐ Tìm kiếm bằng $OR (Chỉ Văn bản hoặc chỉ Giá)...');
        tourData = await Tour.find(combinedConditions[0]).lean(); 
    } else {
        // Trường hợp không có điều kiện nào được kích hoạt
        console.log('❌ Không có điều kiện tìm kiếm cụ thể.');
        tourData = [];
    }
    
    
    console.log(`✅ Tìm thấy ${tourData.length} tour`);
    
    // Debug chi tiết kết quả tìm được (Chỉ hiển thị 5 tour đầu)
    if (tourData.length > 0) {
      console.log('📝 Tour tìm được (5 tour đầu):');
      tourData.slice(0, 5).forEach((tour, index) => {
        console.log(`  ${index + 1}. ${tour.title} - ${tour.destination} - ${tour.price ? tour.price.toLocaleString() : 'N/A'} VND`);
      });
    } else {
      console.log('❌ Không tìm thấy tour nào.');
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

  // Policy search
  if (lowercaseQuery.includes("hủy") || lowercaseQuery.includes("hủy tour") || lowercaseQuery.includes("hoàn tiền")) {
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
  
  // Contact search
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
    lowercaseQuery.includes("công ty") ||
    lowercaseQuery.includes("văn phòng")
  ) {
    info.push(`Địa chỉ: ${companyInfo.address}`);
  }

  return info;
};

// Hàm search tổng hợp
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

  // Phân loại kết quả companyResults
  results.policies = companyResults.filter(
    (item) =>
      item.includes("Hủy trước") ||
      item.includes("Quý khách chọn thanh toán") ||
      item.includes("phương thức thanh toán")
  );
  results.companyInfo = companyResults.filter(
    (item) =>
      item.includes("Hotline") ||
      item.includes("Địa chỉ")
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
      context += `- Danh mục: ${tour.category || "Không xác định"}\n`;
      context += `- Thời gian: ${tour.duration || "Không xác định"}\n`;
      context += `- Giá gốc: ${
        tour.price ? tour.price.toLocaleString() + " VND" : "Liên hệ"
      }\n`;

      // Thêm giá discount nếu có 
      if (tour.discountPrice && tour.discountPrice > 0) {
        context += `- Giá khuyến mãi: ${tour.discountPrice.toLocaleString()} VND\n`;
      }
      
      // Chỉ hiển thị mô tả ngắn
      const shortDescription = tour.description ? tour.description.substring(0, 100) + '...' : 'Không có';
      context += `- Mô tả (Ngắn): ${shortDescription}\n`;

      // Thêm tags nếu có
      if (tour.tags && tour.tags.length > 0) {
        context += `- Thẻ: ${tour.tags.join(", ")}\n`;
      }

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

  // Policies
  if (relevantData.policies.length > 0) {
    context += "=== CHÍNH SÁCH ===\n";
    relevantData.policies.forEach((policy) => {
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