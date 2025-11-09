import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Phone, MapPin, Calendar, X, MessageCircle } from 'lucide-react';
import sumaryApi from '../../common';
import { useNavigate } from 'react-router-dom';

const ChatPopup = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý ảo của Travel. Tôi có thể giúp bạn tìm tour du lịch phù hợp! 🏝️',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relevantTours, setRelevantTours] = useState([]);
  const messagesEndRef = useRef(null);


  const suggestedQuestions = [
    "Tour Đà Nẵng giá bao nhiêu?",
    "Có tour quốc tế nào không?",
    "Chính sách hủy tour thế nào?",
    "Tour Phú Quốc có gì hay?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageContent = inputMessage) => {
    const contentToSend = messageContent || inputMessage;
    if (!contentToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: contentToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setRelevantTours([]);

    try {
      const response = await fetch(sumaryApi.AIChat.url, {
        method: sumaryApi.AIChat.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contentToSend,
          session_id: 'travel-chat'
        })
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.relevant_tours && data.relevant_tours.length > 0) {
        setRelevantTours(data.relevant_tours);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 😔',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Cuộc trò chuyện đã được làm mới! Tôi có thể giúp gì cho chuyến du lịch của bạn? 🎉',
        timestamp: new Date()
      }
    ]);
    setRelevantTours([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const TourCard = ({ tour }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 text-xs">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 leading-tight flex-1 mr-2 line-clamp-2">
          {tour.title}
        </h3>
        <div className="flex flex-col items-end shrink-0">
          {tour.discountPrice ? (
            <>
              <span className="text-red-600 font-bold">
                {tour.discountPrice.toLocaleString()} VND
              </span>
              <span className="text-gray-500 line-through text-xs">
                {tour.price?.toLocaleString()} VND
              </span>
            </>
          ) : (
            <span className="text-green-600 font-bold">
              {tour.price?.toLocaleString() || 'Liên hệ'} VND
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1 text-gray-600 mb-2">
        <div className="flex items-center space-x-1">
          <MapPin size={10} className="text-blue-500" />
          <span className="flex-1 truncate">{tour.destination}</span>
        </div>
      </div>

      <div className="flex space-x-1">
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs transition-colors"
          onClick={() => navigate(`/detail/${tour._id}`)}
        >
          Chi tiết
        </button>
        <button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs transition-colors"
          onClick={() => navigate(`/booking?tourId=${tour?._id}`)}
        >
          Đặt tour
        </button>
      </div>
    </div>
  );

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-green-500 text-white'
          }`}>
          {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
        </div>

        {/* Message Content */}
        <div className={`rounded-xl px-3 py-2 ${message.role === 'user'
          ? 'bg-blue-500 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
            {message.timestamp.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
        {/* Notification dot */}
        {!isOpen && messages.length > 1 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-2000 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Trợ lý Travel</h3>
                  <p className="text-blue-100 text-xs">Đang trực tuyến</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Xóa hội thoại"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Relevant Tours */}
              {relevantTours.length > 0 && (
                <div className="mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-semibold text-blue-900 text-xs mb-2">
                      🎯 Tour phù hợp:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {relevantTours.slice(0, 2).map((tour) => (
                        <TourCard key={tour._id || tour.id} tour={tour} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[90%]">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-xl rounded-bl-none px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Questions */}
          {messages.length <= 2 && (
            <div className="border-t border-gray-200 bg-white px-3 py-2">
              <p className="text-xs font-medium text-gray-600 mb-2">💡 Hỏi nhanh:</p>
              <div className="grid grid-cols-2 gap-1">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-left p-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded text-xs transition-colors text-gray-700 hover:text-blue-700 truncate"
                    title={question}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Trợ lý ảo • 0397 961 994
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-10 z-10"
          onClick={toggleChat}
        ></div>
      )}
    </>
  );
};

export default ChatPopup;