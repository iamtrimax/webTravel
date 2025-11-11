const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchRelevantData, formatContextForAI, companyInfo } = require("../utils/embedding_search.utils");
require("dotenv").config()
 const genAI = new GoogleGenerativeAI(process.env.API_GEMINI_KEY)

const getAIResponseWithContext = async (userMessage, conversationHistory = [])=>{
   try {
    // 1. Tìm dữ liệu liên quan từ database
    const relevantData = await searchRelevantData(userMessage);
    const context = formatContextForAI(relevantData);
    
    // 2. Build prompt với context
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
      conversationHistory.slice(-4).forEach(msg => {
        const role = msg.role === 'user' ? 'Khách hàng' : 'Trợ lý';
        conversationContext += `${role}: ${msg.content}\n`;
      });
    }

    const fullPrompt = `${systemPrompt}${conversationContext}\n\nKhách hàng: ${userMessage}\nTrợ lý:`;
    
    // 4. Gọi Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    return {
      success: true,
      message: response.text(),
      relevantData: relevantData,
      usage: result.usageMetadata || {}
    };
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback response
    const fallbackResponse = await generateFallbackResponse(userMessage);
    
    return {
      success: false,
      message: fallbackResponse,
      error: error.message,
      usedFallback: true
    };
  }

}
const generateFallbackResponse = async(userMessage)=>{
    try {
    const relevantData = await searchRelevantData(userMessage);
    
    if (relevantData.tours.length > 0) {
      const tour = relevantData.tours[0];
      return `Tôi tìm thấy tour phù hợp: "${tour.title}" 
📍 ${tour.destination} | 💰 ${tour.price?.toLocaleString() || 'Liên hệ'} VND
${tour.description?.substring(0, 100)}...

Để biết thêm chi tiết hoặc đặt tour, vui lòng gọi hotline ${companyInfo.phone}!`;
    }
    
    if (userMessage.toLowerCase().includes('hủy')) {
      return `Chính sách hủy tour: ${companyInfo.policies.cancellation}. Chi tiết: ${companyInfo.phone}`;
    }
    
    if (userMessage.toLowerCase().includes('thanh toán')) {
      return `Chính sách thanh toán: ${companyInfo.policies.payment}. Hotline: ${companyInfo.phone}`;
    }
    
    return `Xin chào! Tôi có thể giúp bạn tìm tour du lịch phù hợp. 
Hãy cho tôi biết điểm đến, ngân sách, hoặc thời gian bạn muốn đi.
Hoặc gọi ${companyInfo.phone} để được tư vấn trực tiếp!`;
    
  } catch (error) {
    return `Xin lỗi, hiện tôi gặp sự cố kỹ thuật. Vui lòng liên hệ hotline ${companyInfo.phone} để được hỗ trợ!`;
  }
}
module.exports = {getAIResponseWithContext}
