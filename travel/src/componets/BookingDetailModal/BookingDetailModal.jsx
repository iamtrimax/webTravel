// Modal chi tiết đặt tour
const BookingDetailModal = ({ booking, onClose, onStatusChange }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>Chi tiết đặt tour - {booking.id}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-sections">
            <div className="detail-section">
              <h4>Thông tin khách hàng</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Họ tên:</label>
                  <span>{booking.customer.name}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{booking.customer.email}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{booking.customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Thông tin tour</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tên tour:</label>
                  <span>{booking.tourTitle}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày đặt:</label>
                  <span>{booking.bookingDate}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày đi:</label>
                  <span>{booking.travelDate}</span>
                </div>
                <div className="detail-item">
                  <label>Số người:</label>
                  <span>{booking.numberOfPeople}</span>
                </div>
                <div className="detail-item">
                  <label>Tổng tiền:</label>
                  <span className="price">{new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(booking.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>Trạng thái</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Trạng thái đặt tour:</label>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status === 'pending' ? 'Chờ xác nhận' : 
                     booking.status === 'confirmed' ? 'Đã xác nhận' : 
                     booking.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Thanh toán:</label>
                  <span className={`payment-badge payment-${booking.paymentStatus}`}>
                    {booking.paymentStatus === 'pending' ? 'Chờ thanh toán' : 
                     booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                     booking.paymentStatus === 'refunded' ? 'Đã hoàn tiền' : 'Lỗi'}
                  </span>
                </div>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="detail-section">
                <h4>Yêu cầu đặc biệt</h4>
                <p>{booking.specialRequests}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Đóng
          </button>
          {booking.status === 'pending' && (
            <>
              <button 
                type="button" 
                onClick={() => onStatusChange(booking.id, 'confirmed')}
                className="confirm-btn"
              >
                Xác nhận đặt tour
              </button>
              <button 
                type="button" 
                onClick={() => onStatusChange(booking.id, 'cancelled')}
                className="cancel-booking-btn"
              >
                Hủy đặt tour
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookingDetailModal;