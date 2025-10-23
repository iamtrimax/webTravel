import React from 'react'
import formatPrice from '../../helper/formatPrice';

const DateSelection = ({ selectedTour, bookingDate, setBookingDate, travelers, handleTravelersChange, setActiveStep, setSelectedTour, navigate }) => {
  return (
        <section className="date-selection">
          <div className="container">
            <div className="selection-content">
              {/* Tour Summary */}
              <div className="tour-summary">
                <h3>Tour Đã Chọn</h3>
                <div className="summary-card">
                  <img src={selectedTour.images[0]?.url} alt={selectedTour.title} />
                  <div className="summary-info">
                    <h4>{selectedTour.title}</h4>
                    <p>📍 {selectedTour.destination}</p>
                    <p>📅 {`${selectedTour.duration} ngày ${selectedTour.duration - 1} đêm`}</p>
                    <div className="summary-price">{formatPrice(selectedTour.discountPrice || selectedTour.price)}/người</div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="date-section">
                <h3>Chọn Ngày Khởi Hành</h3>
                <div className="date-grid">
                  {selectedTour.startDates?.filter((date =>new Date(date) > new Date())).map((date, index) => (
                    <div
                      key={index}
                      className={`date-card ${bookingDate === date ? 'selected' : ''}`}
                      onClick={() => setBookingDate(date)}
                    >
                      <div className="date-day">Thứ {index + 2}</div>
                      <div className="date-number">{new Date(date).getDate()}</div>
                      <div className="date-month">Tháng {new Date(date).getMonth() + 1}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travelers Selection */}
              <div className="travelers-section">
                <h3>Chọn Số Lượng Người</h3>
                <div className="travelers-simple">
                  <div className="traveler-counter">
                    <label>Số lượng người tham gia</label>
                    <div className="counter-wrapper">
                      <button
                        className="counter-btn"
                        onClick={() => handleTravelersChange(-1)}
                        disabled={travelers <= 1}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <div className="counter-display">
                        <span className="counter-value">{travelers}</span>
                        <span className="counter-label">người</span>
                      </div>
                      <button
                        className="counter-btn"
                        onClick={() => handleTravelersChange(1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="counter-note">
                      <i className="fas fa-info-circle"></i>
                      Số lượng tối thiểu: 1 người
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="back-btn" onClick={() => {
                  setSelectedTour(null);
                  setActiveStep(1);
                  // ✅ FIX: Clear URL parameters khi quay lại
                  navigate('/booking');
                }}>
                  <i className="fas fa-arrow-left"></i>
                  Quay Lại Chọn Tour
                </button>
                <button
                  className="next-btn"
                  onClick={() => setActiveStep(3)}
                  disabled={!bookingDate}
                >
                  Tiếp Theo: Thông Tin Khách Hàng
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
    )
}

export default DateSelection