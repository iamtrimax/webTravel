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

const searchTours = async (query) => {
    try {
        const lowercaseQuery = query.toLowerCase().trim();
        console.log(`🔍 Search query: "${query}" -> "${lowercaseQuery}"`);

        const combinedConditions = [];
        let tourData = [];
        let isGenericSearch = false; // <<< BIẾN CỜ MỚI

        // --- 1. Nhóm điều kiện tìm kiếm GIÁ ---
        const priceConditions = [];
        const priceStopWords = ['giá', 'gia', 'rẻ', 're', 'triệu', 'tr', 'k', 'nghìn', 'vnd'];

        // Tìm kiếm theo từ khóa 'giá' hoặc 'rẻ'
        if (lowercaseQuery.includes('giá') || lowercaseQuery.includes('gia')) {
            priceConditions.push({ price: { $exists: true, $ne: null } });
        }
        if (lowercaseQuery.includes('rẻ') || lowercaseQuery.includes('re')) {
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
            combinedConditions.push({ $or: priceConditions });
        }


        // --- 2. Nhóm điều kiện tìm kiếm VĂN BẢN/TỪ KHÓA ---
        const textConditions = [];
        const basicSearchFields = ['title', 'destination', 'description', 'category'];

        // Lọc bỏ các từ khóa giá khỏi tìm kiếm văn bản
        const keywords = lowercaseQuery.split(/\s+/)
            .filter(word =>
                word.length >= 2 && // Lọc từ ngắn
                !priceStopWords.includes(word) && // Lọc từ khóa giá
                (!priceMatch || !word.includes(priceMatch[1])) // Lọc con số đã khớp
            );

        console.log(`[Debug] Filtered keywords for text search:`, keywords);

        if (keywords.length > 0) {
            keywords.forEach(keyword => {
                const keywordOrConditions = basicSearchFields.map(field => ({
                    [field]: { $regex: keyword, $options: 'i' }
                }));
                keywordOrConditions.push({ tags: { $in: [new RegExp(keyword, 'i')] } }); 
                textConditions.push({ $or: keywordOrConditions });
            });

            // $and: Tour phải chứa TẤT CẢ các từ khóa văn bản
            combinedConditions.push({ $and: textConditions });

        } else if (keywords.length === 0 && priceConditions.length === 0) {
            // *** SỬA LỖI: XỬ LÝ CÂU HỎI CHUNG CHUNG BẰNG BIẾN CỜ ***
            const genericWords = ['tour', 'còn', 'gì', 'hiện có', 'du lịch', 'giới thiệu'];
            const isGenericQuestion = genericWords.some(word => lowercaseQuery.includes(word));

            if (isGenericQuestion) {
                // Nếu là câu hỏi chung chung, SET CỜ isGenericSearch = true
                console.log('⭐ Phát hiện câu hỏi chung chung. Chuẩn bị trả về Top 5 tour.');
                isGenericSearch = true; // <<< CHỈ SET CỜ, KHÔNG PUSH ĐIỀU KIỆN
            } else {
                // Trường hợp truy vấn quá ngắn (VD: "a") hoặc không liên quan ("hello")
                console.log('[Debug] No keywords, no price. Searching for original query in text.');
                const keywordOrConditions = basicSearchFields.map(field => ({
                    [field]: { $regex: lowercaseQuery, $options: 'i' }
                }));
                keywordOrConditions.push({ tags: { $in: [new RegExp(lowercaseQuery, 'i')] } });
                combinedConditions.push({ $or: keywordOrConditions });
            }
        }


        console.log('📋 Final Search conditions:', JSON.stringify(combinedConditions, null, 2));

        // --- 3. Thực hiện tìm kiếm TỔNG HỢP ---

        if (isGenericSearch) { // <<< ƯU TIÊN XỬ LÝ CỜ NÀY TRƯỚC
            console.log('🌟 Thực thi tìm kiếm Top Tour Mới Nhất.');
            tourData = await Tour.find().sort({ createdAt: -1 }).limit(5).lean();

        } else if (combinedConditions.length === 2) {
            // Có cả 2 điều kiện (Văn bản VÀ Giá)
            console.log('⭐ Thử tìm kiếm bằng $AND (Văn bản & Giá)...');
            tourData = await Tour.find({ $and: combinedConditions }).lean();

            // Nếu không tìm thấy, thử $OR (Văn bản HOẶC Giá)
            if (tourData.length === 0) {
                console.log('⭐ Không tìm thấy $AND, thử tìm kiếm bằng $OR (Văn bản hoặc Giá)...');
                tourData = await Tour.find({ $or: combinedConditions }).lean();
            }
        } else if (combinedConditions.length === 1) {
            // Trường hợp chỉ có Giá HOẶC chỉ có Từ khóa Nghiêm ngặt
            console.log('⭐ Tìm kiếm bằng 1 điều kiện (Chỉ Văn bản hoặc chỉ Giá)...');
            tourData = await Tour.find(combinedConditions[0]).lean(); 
        } else {
            // Không có điều kiện nào
            console.log('❌ Không có điều kiện tìm kiếm cụ thể.');
            tourData = await Tour.find().lean();
        }

        // ... (Log tìm kiếm giữ nguyên)
        console.log(`✅ Tìm thấy ${tourData.length} tour`);
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

    results.tours = await searchTours(query);
    console.log(`📊 Tìm thấy ${results.tours.length} tour`);

    const companyResults = searchCompanyInfo(query);
    console.log(`📋 Kết quả tìm kiếm company info:`, companyResults);

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
        policies: results.policies.length,
        companyInfo: results.companyInfo.length,
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

            if (tour.discountPrice && tour.discountPrice > 0) {
                context += `- Giá khuyến mãi: ${tour.discountPrice.toLocaleString()} VND\n`;
            }

            const shortDescription = tour.description ? tour.description.substring(0, 100) + '...' : 'Không có';
            context += `- Mô tả (Ngắn): ${shortDescription}\n`;

            if (tour.tags && tour.tags.length > 0) {
                context += `- Thẻ: ${tour.tags.join(", ")}\n`;
            }

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