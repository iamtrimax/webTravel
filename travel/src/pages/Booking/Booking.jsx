import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Booking.scss';

const Booking = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingData, setBookingData] = useState(null);
  const location = useLocation();

  // Mock data for tours
  const tours = [
    {
      id: 1,
      name: 'Phố Cổ Hội An - Di Sản Văn Hóa',
      location: 'Hội An, Quảng Nam',
      price: 2490000,
      duration: '3 ngày 2 đêm',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Khám phá vẻ đẹp cổ kính của phố cổ Hội An',
      availableDates: ['2024-03-15', '2024-03-20', '2024-03-25'],
      category: 'cultural'
    },
    {
      id: 2,
      name: 'Vịnh Hạ Long - Kỳ Quan Thiên Nhiên',
      location: 'Quảng Ninh',
      price: 3890000,
      duration: '2 ngày 1 đêm',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1575381813691-465c8eac364e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Trải nghiệm du thuyền sang trọng khám phá vịnh Hạ Long',
      availableDates: ['2024-03-18', '2024-03-22', '2024-03-28'],
      category: 'adventure'
    },
    {
      id: 3,
      name: 'Đà Lạt - Thành Phố Ngàn Hoa',
      location: 'Lâm Đồng',
      price: 3190000,
      duration: '4 ngày 3 đêm',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1596199050104-6e5a2a5c4b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      description: 'Đắm chìm trong không khí se lạnh của Đà Lạt',
      availableDates: ['2024-03-16', '2024-03-23', '2024-03-30'],
      category: 'cultural'
    }
  ];

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const steps = [
    { number: 1, title: 'Chọn Tour', icon: '🗺️' },
    { number: 2, title: 'Chọn Ngày & Số Lượng', icon: '📅' },
    { number: 3, title: 'Thanh Toán', icon: '💳' },
    { number: 4, title: 'Xác Nhận', icon: '✅' }
  ];

  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    setActiveStep(2);
  };

  const handleBookingSubmit = () => {
    const booking = {
      id: Date.now(),
      tour: selectedTour,
      date: bookingDate,
      travelers,
      total: selectedTour.price * travelers,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    setBookingData(booking);
    setActiveStep(4);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleTravelersChange = (amount) => {
    setTravelers(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="booking-page">
      {/* Header Section */}
      <section className="booking-header">
        <div className="container">
          <h1 className="page-title">Đặt Tour Du Lịch</h1>
          <p className="page-subtitle">Trải nghiệm hành trình tuyệt vời với dịch vụ đặt tour dễ dàng</p>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="booking-steps">
        <div className="container">
          <div className="steps-container">
            {steps.map(step => (
              <div key={step.number} className={`step-item ${activeStep >= step.number ? 'active' : ''}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <div className="step-number">Bước {step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
                {step.number < steps.length && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 1: Tour Selection */}
      {activeStep === 1 && (
        <section className="tour-selection">
          <div className="container">
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm tour theo tên hoặc địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">
                  <span>Tìm Kiếm</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              
              {/* Filter Options */}
              <div className="filter-options">
                <button className="filter-btn active">Tất Cả</button>
                <button className="filter-btn">Trong Nước</button>
                <button className="filter-btn">Quốc Tế</button>
                <button className="filter-btn">Phiêu Lưu</button>
                <button className="filter-btn">Văn Hóa</button>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="tours-grid">
              {filteredTours.map(tour => (
                <div key={tour.id} className="tour-card" onClick={() => handleTourSelect(tour)}>
                  <div className="card-image">
                    <img src={tour.image} alt={tour.name} />
                    <div className="card-badge">{tour.category === 'international' ? 'Quốc Tế' : 'Trong Nước'}</div>
                    <div className="card-overlay">
                      <button className="view-detail-btn">Xem Chi Tiết</button>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="tour-meta">
                      <span className="tour-duration">{tour.duration}</span>
                      <span className="tour-rating">⭐ {tour.rating}</span>
                    </div>
                    <h3 className="tour-name">{tour.name}</h3>
                    <p className="tour-location">📍 {tour.location}</p>
                    <p className="tour-description">{tour.description}</p>
                    <div className="card-footer">
                      <div className="tour-price">
                        <span className="price">{formatPrice(tour.price)}</span>
                        <span className="price-note">/người</span>
                      </div>
                      <button className="select-btn">Chọn Tour</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Date & Travelers Selection */}
      {activeStep === 2 && selectedTour && (
        <section className="date-selection">
          <div className="container">
            <div className="selection-content">
              {/* Tour Summary */}
              <div className="tour-summary">
                <h3>Tour Đã Chọn</h3>
                <div className="summary-card">
                  <img src={selectedTour.image} alt={selectedTour.name} />
                  <div className="summary-info">
                    <h4>{selectedTour.name}</h4>
                    <p>📍 {selectedTour.location}</p>
                    <p>📅 {selectedTour.duration}</p>
                    <div className="summary-price">{formatPrice(selectedTour.price)}/người</div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="date-section">
                <h3>Chọn Ngày Khởi Hành</h3>
                <div className="date-grid">
                  {selectedTour.availableDates.map((date, index) => (
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

              {/* Travelers Selection - ĐÃ ĐƠN GIẢN HÓA */}
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
                <button className="back-btn" onClick={() => setActiveStep(1)}>
                  <i className="fas fa-arrow-left"></i>
                  Quay Lại
                </button>
                <button 
                  className="next-btn" 
                  onClick={() => setActiveStep(3)}
                  disabled={!bookingDate}
                >
                  Tiếp Theo: Thanh Toán
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Payment */}
      {activeStep === 3 && selectedTour && (
        <section className="payment-section">
          <div className="container">
            <div className="payment-content">
              {/* Order Summary */}
              <div className="order-summary">
                <h3>Thông Tin Đặt Tour</h3>
                <div className="summary-details">
                  <div className="detail-item">
                    <span>Tour:</span>
                    <span>{selectedTour.name}</span>
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
                    <span>{formatPrice(selectedTour.price)}/người</span>
                  </div>
                  <div className="detail-item total-item">
                    <span>Thành tiền:</span>
                    <span className="total-price">
                      {formatPrice(selectedTour.price * travelers)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <h3>Chọn Phương Thức Thanh Toán</h3>
                <div className="methods-grid">
                  <div 
                    className={`method-card ${paymentMethod === 'credit' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <i className="fas fa-credit-card"></i>
                    <span>Thẻ Tín Dụng</span>
                  </div>
                  <div 
                    className={`method-card ${paymentMethod === 'banking' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('banking')}
                  >
                    <i className="fas fa-university"></i>
                    <span>Chuyển Khoản</span>
                  </div>
                  <div 
                    className={`method-card ${paymentMethod === 'momo' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('momo')}
                  >
                    <i className="fas fa-mobile-alt"></i>
                    <span>Ví MoMo</span>
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
                <button className="back-btn" onClick={() => setActiveStep(2)}>
                  <i className="fas fa-arrow-left"></i>
                  Quay Lại
                </button>
                <button className="confirm-btn" onClick={handleBookingSubmit}>
                  <i className="fas fa-check"></i>
                  Xác Nhận Đặt Tour
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Confirmation */}
      {activeStep === 4 && bookingData && (
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
                    <span>#{bookingData.id}</span>
                  </div>
                  <div className="detail-item">
                    <span>Tour:</span>
                    <span>{bookingData.tour.name}</span>
                  </div>
                  <div className="detail-item">
                    <span>Ngày khởi hành:</span>
                    <span>{new Date(bookingData.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <span>Số lượng:</span>
                    <span>{bookingData.travelers} người</span>
                  </div>
                  <div className="detail-item total-item">
                    <span>Tổng tiền:</span>
                    <span className="total">{formatPrice(bookingData.total)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Trạng thái:</span>
                    <span className="status confirmed">Đã xác nhận</span>
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
      )}
    </div>
  );
};

export default Booking;