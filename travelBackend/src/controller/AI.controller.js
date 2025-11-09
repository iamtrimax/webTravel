const { getAIResponseWithContext } = require("../Services/AIService");

const conversations = new Map()
const AIChat = async(req, res)=>{
    try {
    const { message, session_id = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation history
    if (!conversations.has(session_id)) {
      conversations.set(session_id, []);
    }
    const conversationHistory = conversations.get(session_id);

    // Get AI response với context - THÊM AWAIT
    const aiResponse = await getAIResponseWithContext(message, conversationHistory);

    // Update conversation history
    conversationHistory.push(
      { role: "user", content: message },
      { role: "assistant", content: aiResponse.message }
    );

    // Keep only last 10 messages
    if (conversationHistory.length > 10) {
      conversationHistory.splice(0, 2);
    }

    res.json({
      reply: aiResponse.message,
      session_id: session_id,
      timestamp: new Date().toISOString(),
      provider: 'gemini-ai',
      success: aiResponse.success,
      relevant_tours: aiResponse.relevantData?.tours || [],
      used_fallback: aiResponse.usedFallback || false
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
module.exports = {AIChat}