const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchRelevantData, formatContextForAI, companyInfo } = require("../utils/embedding_search.utils");
require("dotenv").config()
 const genAI = new GoogleGenerativeAI(process.env.API_GEMINI_KEY)

const getAIResponseWithContext = async (userMessage, conversationHistory = []) => {
    
    // Khai báo relevantData ở ngoài để khối catch có thể truy cập
    let relevantData = null; 

    try {
        // 1. Tìm dữ liệu liên quan (chỉ 1 lần)
        relevantData = await searchRelevantData(userMessage); // Gán giá trị
        const context = formatContextForAI(relevantData);
        
        // 2. Build prompt (Giữ nguyên)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const systemPrompt = `...`; // Giữ nguyên system prompt

        // 3. Build history (Giữ nguyên)
        let conversationContext = "..."; // Giữ nguyên logic history

        const fullPrompt = `${systemPrompt}${conversationContext}\n\nKhách hàng: ${userMessage}\nTrợ lý:`;
        
        // 4. Gọi Gemini API (Giữ nguyên)
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        return {
            success: true,
            message: response.text(),
            relevantData: relevantData, // Trả về data đã tìm thấy
            usage: result.usageMetadata || {}
        };
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // *** SỬA Ở ĐÂY ***
        // Truyền relevantData (có thể là null hoặc đã có dữ liệu) vào fallback
        const fallbackResponse = await generateFallbackResponse(userMessage, relevantData);
        
        return {
            success: false,
            message: fallbackResponse,
            error: error.message,
            usedFallback: true
        };
    }
}
// *** SỬA Ở ĐÂY: Chấp nhận tham số relevantData ***
const generateFallbackResponse = async(userMessage, relevantData) => {
    try {
        if (relevantData && relevantData.tours.length > 0) {
            const tour = relevantData.tours[0];
            return `Tôi tìm thấy tour phù hợp: "${tour.title}" 
📍 ${tour.destination} | 💰 ${tour.price?.toLocaleString() || 'Liên hệ'} VND
${tour.description?.substring(0, 100)}...

Để biết thêm chi tiết hoặc đặt tour, vui lòng gọi hotline ${companyInfo.phone}!`;
        }
        
        // Nếu relevantData là null hoặc không có tour (trường hợp search lỗi)
        // Nó sẽ tự động bỏ qua 'if' trên và kiểm tra các điều kiện 'else if'
        
        if (userMessage.toLowerCase().includes('hủy')) {
            return `Chính sách hủy tour: ${companyInfo.policies.cancellation}. Chi tiết: ${companyInfo.phone}`;
        }
        
        if (userMessage.toLowerCase().includes('thanh toán')) {
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
}
module.exports = {getAIResponseWithContext}
