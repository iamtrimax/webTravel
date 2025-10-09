import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Booking.scss';
import { jwtDecode } from 'jwt-decode';
import sumaryApi from '../../common';
import { toast } from 'react-toastify';

const Booking = () => {
  const [tours, setTours] = useState([])
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingData, setBookingData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true); // ✅ Thêm loading state
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("accessToken")
  const decoded = token ? jwtDecode(token) : ''

  // Thêm state cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    fullname: '',
    phone: '',
    address: '',
    specialRequests: ''
  });

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(sumaryApi.getAllTours.url, {
        method: sumaryApi.getAllTours.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setTours(data.data || []);
      return data.data || []; // ✅ Trả về tours data
    } catch (error) {
      console.error('Lỗi khi tải danh sách tour:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIX: Xử lý URL parameters độc lập với tours state
  useEffect(() => {
    const initializeBooking = async () => {
      const urlParams = new URLSearchParams(location.search);
      const tourId = urlParams.get('tourId');
      const selectedDate = urlParams.get('selectedDate');

      if (tourId) {
        // Nếu đã có tours, tìm tour ngay
        if (tours.length > 0) {
          const foundTour = tours.find(tour => tour._id === tourId);
          if (foundTour) {
            setSelectedTour(foundTour);
            setActiveStep(2);
            if (selectedDate) {
              setBookingDate(selectedDate);
            }
          }
        } else {
          // Nếu chưa có tours, fetch tours trước
          const toursData = await fetchTours();
          const foundTour = toursData.find(tour => tour._id === tourId);
          if (foundTour) {
            setSelectedTour(foundTour);
            setActiveStep(2);
            if (selectedDate) {
              setBookingDate(selectedDate);
            }
          }
        }
      } else {
        // Nếu không có tourId, chỉ fetch tours bình thường
        await fetchTours();
      }
    };

    initializeBooking();
  }, [location.search]); // ✅ Chỉ phụ thuộc vào location.search

  // Categories data
  const categories = [
    { id: 'all', name: 'Tất Cả', count: tours.length, icon: '🌍' },
    { id: 'beach', name: 'Biển', count: tours.filter(tour => tour.category === 'beach').length, icon: '🏖️' },
    { id: 'mountain', name: 'Núi', count: tours.filter(tour => tour.category === 'mountain').length, icon: '⛰️' },
    { id: 'adventure', name: 'Phiêu Lưu', count: tours.filter(tour => tour.category === 'adventure').length, icon: '🧗' },
    { id: 'cultural', name: 'Văn Hóa', count: tours.filter(tour => tour.category === 'cultural').length, icon: '🏯' },
    { id: 'city', name: 'Thành Phố', count: tours.filter(tour => tour.category === 'city').length, icon: '🏙️' }
  ];

  // Filter tours based on search and category
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Cập nhật steps để thêm bước thông tin khách hàng
  const steps = [
    { number: 1, title: 'Chọn Tour', icon: '🗺️' },
    { number: 2, title: 'Chọn Ngày & Số Lượng', icon: '📅' },
    { number: 3, title: 'Thông Tin Khách Hàng', icon: '👤' },
    { number: 4, title: 'Thanh Toán', icon: '💳' },
    { number: 5, title: 'Xác Nhận', icon: '✅' }
  ];

  const handleTourSelect = (tour) => {
    if (!token) {
      alert("Bạn cần phải đăng nhập để đặt tour")
      navigate("/login")
      return;
    }
    setSelectedTour(tour);
    setActiveStep(2);
  };

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm kiểm tra thông tin khách hàng đã đầy đủ chưa
  const isCustomerInfoValid = () => {
    return customerInfo.fullname.trim() !== '' &&
      customerInfo.phone.trim() !== '' &&
      customerInfo.address.trim() !== '';
  };

  const handleBookingSubmit = async () => {
    try {
      const fetchBooking = await fetch(sumaryApi.booking.url, {
        method: sumaryApi.booking.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          tourId: selectedTour._id,
          bookingDate: new Date(bookingDate).toString(),
          bookingSlots: travelers,
          fullname: customerInfo.fullname,
          phone: customerInfo.phone,
          address: customerInfo.address,
          specialRequire: customerInfo.specialRequests
        })
      })
      const data = await fetchBooking.json()
      if (data.success) {
        toast.success(data.message)
        setBookingData(data.data);
        setActiveStep(5);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt tour');
      console.error('Booking error:', error);
    }
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

  // ✅ FIX: Thêm loading state cho toàn bộ page
  if (isLoading) {
    return (
      <div className="booking-page">
        <section className="booking-header">
          <div className="container">
            <h1 className="page-title">Đặt Tour Du Lịch</h1>
          </div>
        </section>
        <div className="loading-container">
          <div className="spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

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

      {/* Step 1: Tour Selection - CHỈ HIỆN KHI KHÔNG CÓ TOUR TỪ URL */}
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

              {/* Category Filter - ĐÃ SỬA */}
              <div className="category-filter-section">
                <h4 className="filter-title">Lọc theo danh mục:</h4>
                <div className="category-filters">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filter Display */}
              {selectedCategory !== 'all' && (
                <div className="active-filter">
                  <span>Đang lọc: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
                  <button
                    className="clear-filter-btn"
                    onClick={() => setSelectedCategory('all')}
                  >
                    ✕ Bỏ lọc
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="results-info">
              <p>
                Tìm thấy <strong>{filteredTours.length}</strong> tour
                {selectedCategory !== 'all' && ` trong danh mục ${categories.find(cat => cat.id === selectedCategory)?.name}`}
                {searchQuery && ` với từ khóa "${searchQuery}"`}
              </p>
            </div>

            {/* Tours Grid */}
            <div className="tours-grid">
              {filteredTours.length > 0 ? (
                filteredTours.map(tour => (
                  <div key={tour._id} className="tour-card">
                    <Link to={`/detail/${tour._id}`}>

                      <div className="card-image">
                        <img src={tour.images[0].url} alt={tour.title} />
                        <div className="card-badge">
                          {categories.find(cat => cat.id === tour.category)?.icon}
                          {categories.find(cat => cat.id === tour.category)?.name}
                        </div>
                        <div className="card-overlay">
                          <button className="view-detail-btn">Xem Chi Tiết</button>
                        </div>
                      </div>
                    </Link>
                    <div className="card-content">
                      <div className="tour-meta">
                        <span className="tour-duration">{`${tour.duration} ngày ${tour.duration - 1} đêm`}</span>
                        <span className="tour-rating">⭐ {tour.rating.average}</span>
                      </div>
                      <h3 className="tour-name">{tour.title}</h3>
                      <p className="tour-location">📍 {tour.destination}</p>
                      <p className="tour-description">{tour.description}</p>
                      <div className="card-footer">
                        <div className="tour-price">
                          <span className="price">{formatPrice(tour.discountPrice || tour.price)}</span>
                          <span className="price-note">/người</span>
                        </div>
                        <button className="select-btn" onClick={() => handleTourSelect(tour)}>Chọn Tour</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>Không tìm thấy tour phù hợp</h3>
                  <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
                  <button
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    ↻ Đặt lại bộ lọc
                  </button>
                </div>
              )}
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
                  {selectedTour.startDates?.map((date, index) => (
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
      )}

      {/* Step 3: Customer Information */}
      {activeStep === 3 && selectedTour && (
        <section className="customer-info-section">
          <div className="container">
            <div className="customer-info-content">
              <h2>Thông Tin Khách Hàng</h2>
              <p className="section-description">Vui lòng cung cấp thông tin của bạn để hoàn tất đặt tour</p>

              <div className="customer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullname">Họ và Tên *</label>
                    <input
                      type="text"
                      id="fullname"
                      value={customerInfo.fullname}
                      onChange={(e) => handleCustomerInfoChange('fullname', e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="phone">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="address">Địa Chỉ *</label>
                    <input
                      type="text"
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ liên hệ"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="specialRequests">Yêu Cầu Đặc Biệt</label>
                    <textarea
                      id="specialRequests"
                      value={customerInfo.specialRequests}
                      onChange={(e) => handleCustomerInfoChange('specialRequests', e.target.value)}
                      placeholder="Nhập các yêu cầu đặc biệt (dị ứng thức ăn, yêu cầu ăn uống, yêu cầu phòng ở, v.v.)"
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>

                <div className="form-note">
                  <i className="fas fa-info-circle"></i>
                  Các trường có dấu * là bắt buộc
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="back-btn" onClick={() => setActiveStep(2)}>
                  <i className="fas fa-arrow-left"></i>
                  Quay Lại
                </button>
                <button
                  className="next-btn"
                  onClick={() => setActiveStep(4)}
                  disabled={!isCustomerInfoValid()}
                >
                  Tiếp Theo: Thanh Toán
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Payment */}
      {activeStep === 4 && selectedTour && (
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
                <button className="back-btn" onClick={() => setActiveStep(3)}>
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

      {/* Step 5: Confirmation */}
      {activeStep === 5 && bookingData && (
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
                    <span>{selectedTour.title}</span>
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
                    <span className="status confirmed">{bookingData.bookingStatus === "pending" ? "Chưa xác nhận" : "Xác nhận"}</span>
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