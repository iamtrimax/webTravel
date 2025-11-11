const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  searchRelevantData,
  formatContextForAI,
  companyInfo,
} = require("../utils/embedding_search.utils");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI_KEY);

// Thêm hàm helper (trợ giúp) này ở đâu đó trong file
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getAIResponseWithContext = async (
  userMessage,
  conversationHistory = []
) => {
  let relevantData = null;

  try {
    relevantData = await searchRelevantData(userMessage);
    const context = formatContextForAI(relevantData);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const systemPrompt = `Bạn là trợ lý ảo cho công ty du lịch ${companyInfo.name}.

HÃY CHỈ SỬ DỤNG THÔNG TIN DƯỚI ĐÂY ĐỂ TRẢ LỜI, KHÔNG TỰ BỊA RA THÔNG TIN:



${context}



QUY TẮC QUAN TRỌNG:

1. CHỈ sử dụng thông tin tour có trong dữ liệu trên

2. Nếu không có tour phù hợp, đề xuất tour tương tự từ danh sách hoặc nói "Hiện không có tour phù hợp"

3. KHÔNG ĐƯỢC tạo ra tour mới không có trong dữ liệu

4. Luôn cung cấp thông tin chính xác từ dữ liệu

5. Giữ thái độ thân thiện, chuyên nghiệp

6. Trả lời bằng tiếng Việt tự nhiên

7. Luôn đề cập hotline ${companyInfo.phone} khi tư vấn tour



Hãy trả lời dựa trên dữ liệu trên:`;
    // 3. Build conversation history

    let conversationContext = "";

    if (conversationHistory.length > 0) {
      conversationContext = "\nLỊCH SỬ HỘI THOẠI:\n";

      conversationHistory.slice(-4).forEach((msg) => {
        const role = msg.role === "user" ? "Khách hàng" : "Trợ lý";

        conversationContext += `${role}: ${msg.content}\n`;
      });
    }
    // --- BẮT ĐẦU LOGIC THỬ LẠI ---
    let result;
    let success = false;
    const maxRetries = 3; // Thử lại tối đa 3 lần

    for (let i = 0; i < maxRetries; i++) {
      try {
        result = await model.generateContent(fullPrompt);
        success = true; // Nếu chạy đến đây là thành công
        break; // Thoát khỏi vòng lặp
      } catch (error) {
        // Chỉ thử lại nếu lỗi là 503 (quá tải)
        if (error.status === 503 && i < maxRetries - 1) {
          console.warn(
            `[Retry ${i + 1}] Gemini 503 Overloaded. Retrying in ${i + 1}s...`
          );
          await sleep((i + 1) * 1000); // Chờ 1s, rồi 2s
        } else {
          // Nếu là lỗi khác, hoặc hết số lần thử, ném lỗi ra ngoài
          throw error;
        }
      }
    }
    // --- KẾT THÚC LOGIC THỬ LẠI ---

    if (!success || !result) {
      throw new Error("Failed to get response from Gemini after retries.");
    }

    const response = await result.response;

    return {
      success: true,
      message: response.text(),
      relevantData: relevantData,
      usage: result.usageMetadata || {},
    };
  } catch (error) {
    console.error("Gemini API Error (After Retries):", error);

    // Vẫn gọi fallback như bình thường nếu thử lại thất bại
    const fallbackResponse = await generateFallbackResponse(
      userMessage,
      relevantData
    );

    return {
      success: false,
      message: fallbackResponse,
      error: error.message,
      usedFallback: true,
    };
  }
};
// *** SỬA Ở ĐÂY: Chấp nhận tham số relevantData ***
const generateFallbackResponse = async (userMessage, relevantData) => {
  try {
    if (relevantData && relevantData.tours.length > 0) {
      const tour = relevantData.tours[0];
      return `Tôi tìm thấy tour phù hợp: "${tour.title}" 
📍 ${tour.destination} | 💰 ${tour.price?.toLocaleString() || "Liên hệ"} VND
${tour.description?.substring(0, 100)}...

Để biết thêm chi tiết hoặc đặt tour, vui lòng gọi hotline ${
        companyInfo.phone
      }!`;
    }

    // Nếu relevantData là null hoặc không có tour (trường hợp search lỗi)
    // Nó sẽ tự động bỏ qua 'if' trên và kiểm tra các điều kiện 'else if'

    if (userMessage.toLowerCase().includes("hủy")) {
      return `Chính sách hủy tour: ${companyInfo.policies.cancellation}. Chi tiết: ${companyInfo.phone}`;
    }

    if (userMessage.toLowerCase().includes("thanh toán")) {
      return `Chính sách thanh toán: ${companyInfo.policies.payment}. Hotline: ${companyInfo.phone}`;
    }

    // Fallback cuối cùng
    return `Xin chào! Tôi có thể giúp bạn tìm tour du lịch phù hợp. 
Hãy cho tôi biết điểm đến, ngân sách, hoặc thời gian bạn muốn đi.
Hoặc gọi ${companyInfo.phone} để được tư vấn trực tiếp!`;
  } catch (error) {
    // Lỗi này chỉ xảy ra nếu có lỗi logic bên trong chính hàm fallback
    return `Xin lỗi, hiện tôi gặp sự cố kỹ thuật. Vui lòng liên hệ hotline ${companyInfo.phone} để được hỗ trợ!`;
  }
};
module.exports = { getAIResponseWithContext };
