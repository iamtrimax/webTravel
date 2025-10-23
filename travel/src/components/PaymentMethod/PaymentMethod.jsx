import React from 'react'
import formatPrice from '../../helper/formatPrice'

const PaymentMethod = ({ selectedTour, bookingDate, travelers, customerInfo, paymentMethod, setPaymentMethod, setActiveStep, handleBookingSubmit }) => {
    return (
        <section className="payment-section">
            <div className="container">
                <div className="payment-content">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Thông Tin Đặt Tour</h3>
                        <div className="summary-details">
                            <div className="detail-item">
                                <span>Tour:</span>
                                <span>{selectedTour.title}</span>
                            </div>
                            <div className="detail-item">
                                <span>Ngày khởi hành:</span>
                                <span>{new Date(bookingDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="detail-item">
                                <span>Số lượng:</span>
                                <span>{travelers} người</span>
                            </div>
                            <div className="detail-item">
                                <span>Đơn giá:</span>
                                <span>{formatPrice(selectedTour.discountPrice || selectedTour.price)}/người</span>
                            </div>
                            <div className="detail-item total-item">
                                <span>Thành tiền:</span>
                                <span className="total-price">
                                    {formatPrice((selectedTour.discountPrice || selectedTour.price) * travelers)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info Summary */}
                    <div className="customer-summary">
                        <h3>Thông Tin Khách Hàng</h3>
                        <div className="summary-details">
                            <div className="detail-item">
                                <span>Họ tên:</span>
                                <span>{customerInfo.fullname}</span>
                            </div>
                            <div className="detail-item">
                                <span>Số điện thoại:</span>
                                <span>{customerInfo.phone}</span>
                            </div>
                            <div className="detail-item">
                                <span>Địa chỉ:</span>
                                <span>{customerInfo.address}</span>
                            </div>
                            {customerInfo.specialRequests && (
                                <div className="detail-item">
                                    <span>Yêu cầu đặc biệt:</span>
                                    <span>{customerInfo.specialRequests}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="payment-methods">
                        <h3>Chọn Phương Thức Thanh Toán</h3>
                        <div className="methods-grid">
                            <div
                                className={`method-card ${paymentMethod === 'banking' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('banking')}
                            >
                                <i className="fas fa-university"></i>
                                <span>Chuyển Khoản</span>
                            </div>
                            <div
                                className={`method-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('cash')}
                            >
                                <i className="fas fa-money-bill-wave"></i>
                                <span>Tiền Mặt</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button className="back-btn" onClick={() => setActiveStep(3)}>
                            <i className="fas fa-arrow-left"></i>
                            Quay Lại
                        </button>
                        <button className="confirm-btn" type='button' onClick={(e)=>handleBookingSubmit(e)}>
                            <i className="fas fa-check"></i>
                            Xác Nhận Đặt Tour
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default PaymentMethod