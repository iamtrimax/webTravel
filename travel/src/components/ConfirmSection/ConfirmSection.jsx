import React from 'react'
import formatPrice from '../../helper/formatPrice'

const ConfirmSection = ({ bookingData, decoded }) => {
  return (
        <section className="confirmation-section">
          <div className="container">
            <div className="confirmation-content">
              <div className="success-icon">✅</div>
              <h2>Đặt Tour Thành Công!</h2>
              <p>Cảm ơn bạn đã đặt tour với chúng tôi. Thông tin đặt tour đã được gửi đến email của bạn.</p>

              <div className="booking-details">
                <h3>Thông Tin Đặt Tour</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span>Mã đặt tour:</span>
                    <span>#{bookingData.idBooking}</span>
                  </div>
                  <div className="detail-item">
                    <span>Tour:</span>
                    <span>{bookingData?.tour?.title}</span>
                  </div>
                  <div className="detail-item">
                    <span>Ngày khởi hành:</span>
                    <span>{new Date(bookingData.bookingDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <span>Số lượng:</span>
                    <span>{bookingData.bookingSlots} người</span>
                  </div>
                  <div className="detail-item">
                    <span>Khách hàng:</span>
                    <span>{bookingData.fullname}</span>
                  </div>
                  <div className="detail-item">
                    <span>Liên hệ:</span>
                    <span>{bookingData.phone} | {decoded.email}</span>
                  </div>
                  <div className="detail-item total-item">
                    <span>Tổng tiền:</span>
                    <span className="total">{formatPrice(bookingData.totalPrice)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Trạng thái:</span>
                    <span className="status confirmed">chưa xác nhận</span>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="print-btn">
                  <i className="fas fa-print"></i>
                  In Vé
                </button>
                <button className="email-btn">
                  <i className="fas fa-envelope"></i>
                  Gửi Email
                </button>
                <button className="home-btn" onClick={() => window.location.href = '/'}>
                  <i className="fas fa-home"></i>
                  Về Trang Chủ
                </button>
              </div>
            </div>
          </div>
        </section>
  )
}

export default ConfirmSection