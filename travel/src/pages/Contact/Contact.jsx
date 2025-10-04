import React, { useState } from 'react';
import sumaryApi from '../../common';

const Contact = () => {
    const [formData, setFormData] = useState({
        subject: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const token = localStorage.getItem("accessToken")
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const sendMail = await fetch(sumaryApi.userSendMail.url, {
                method: sumaryApi.userSendMail.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)

            })
            const data = await sendMail.json()
            if (data.success) {

                setSubmitStatus("success")
                setSubmitStatus('success');
                setFormData({ subject: '', content: '' });
            }
            if (data.error) {
                setSubmitStatus('error');

            }

            // Reset status sau 5 giây
            setTimeout(() => setSubmitStatus(''), 5000);
        } catch (error) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(''), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
                        Hãy gửi thông tin liên hệ và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                Thông Tin Liên Hệ
                            </h2>

                            {/* Phone */}
                            <div className="flex items-start mb-8">
                                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Điện Thoại</h3>
                                    <p className="text-gray-600">+84 123 456 789</p>
                                    <p className="text-gray-600">+84 987 654 321</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start mb-8">
                                <div className="bg-green-100 p-3 rounded-lg mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                    <p className="text-gray-600">support@travelcompany.com</p>
                                    <p className="text-gray-600">info@travelcompany.com</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start mb-8">
                                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Địa Chỉ</h3>
                                    <p className="text-gray-600">123 Đường ABC</p>
                                    <p className="text-gray-600">Quận XYZ, TP. Hồ Chí Minh</p>
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="flex items-start">
                                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Giờ Làm Việc</h3>
                                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                                    <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                                    <p className="text-gray-600">Chủ nhật: Nghỉ</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                Gửi Tin Nhắn Cho Chúng Tôi
                            </h2>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-green-800 font-medium">
                                            Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-800 font-medium">
                                            Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                                        </span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {
                                    token ? ("") :
                                        (
                                            <span className="text-red-800 font-medium">
                                                Đăng nhập để gửi tin nhắn cho chúng tôi
                                            </span>
                                        )
                                }

                                {/* Subject Field */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu Đề *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Tiêu đề tin nhắn"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội Dung Tin Nhắn *
                                    </label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={!token || isSubmitting}
                                        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${!token || isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang gửi...
                                            </div>
                                        ) : (
                                            'Gửi Tin Nhắn'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-96 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <p className="text-gray-500 text-lg">Bản đồ sẽ được hiển thị tại đây</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;