import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TourDetail.scss';

const TourDetail = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Demo data - không cần call API
  const tour = {
    _id: 'demo-tour-1',
    title: 'Khám Phá Vịnh Hạ Long - Kỳ Quan Thiên Nhiên Thế Giới',
    description: 'Hành trình khám phá Vịnh Hạ Long - di sản thiên nhiên thế giới được UNESCO công nhận. Trải nghiệm du thuyền sang trọng, thưởng ngoạn cảnh đẹp ngoạn mục của những hòn đảo đá vôi hùng vĩ, hang động kỳ bí và làng chài truyền thống.',
    destination: 'Vịnh Hạ Long, Quảng Ninh',
    duration: 3,
    price: 3500000,
    discountPrice: 2990000,
    category: 'beach',
    images: [
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
      { url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
      { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' },
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }
    ],
    startDates: [
      '2024-02-15',
      '2024-02-20',
      '2024-02-25',
      '2024-03-01',
      '2024-03-05'
    ],
    highlights: [
      'Du thuyền 5 sao sang trọng',
      'Tham quan Hang Sửng Sốt - hang động đẹp nhất Hạ Long',
      'Chèo kayak khám phá hang Luồn',
      'Ngắm bình minh trên vịnh',
      'Thưởng thức hải sản tươi sống',
      'Tham quan làng chài Vung Viêng'
    ],
    itinerary: [
      {
        title: 'Ngày 1: Hà Nội - Hạ Long - Du thuyền',
        description: 'Khởi hành từ Hà Nội, đón du khách tại điểm hẹn. Di chuyển đến Hạ Long, check-in du thuyền và thưởng thức bữa trưa với hải sản tươi ngon.',
        activities: [
          '08:00: Đón khách tại điểm hẹn ở Hà Nội',
          '12:00: Check-in du thuyền, thưởng thức bữa trưa',
          '14:00: Tham quan Hang Sửng Sốt',
          '16:00: Chèo kayak tại hang Luồn',
          '19:00: Bữa tối trên du thuyền, câu mực đêm'
        ]
      },
      {
        title: 'Ngày 2: Khám Phá Vịnh Hạ Long',
        description: 'Ngày trọn vẹn khám phá vẻ đẹp của Vịnh Hạ Long với các điểm đến nổi tiếng và hoạt động thú vị.',
        activities: [
          '06:00: Ngắm bình minh trên vịnh, tập Thái Cực Quyền',
          '08:00: Tham quan làng chài Vung Viêng',
          '10:00: Bơi lội tại bãi biển Titop',
          '12:00: Bữa trưa trên du thuyền',
          '14:00: Tham quan hang Trinh Nữ',
          '17:00: Nấu lớp học ẩm thực Việt'
        ]
      },
      {
        title: 'Ngày 3: Hạ Long - Hà Nội',
        description: 'Buổi sáng thư giãn và khám phá nốt những điểm đến cuối cùng trước khi trở về Hà Nội.',
        activities: [
          '06:30: Ngắm bình minh, tập yoga',
          '08:00: Tham quan hang Đầu Gỗ',
          '09:30: Check-out du thuyền',
          '10:30: Bữa brunch trước khi rời đi',
          '12:00: Khởi hành về Hà Nội',
          '16:00: Về đến Hà Nội, kết thúc tour'
        ]
      }
    ],
    included: [
      'Phòng nghỉ trên du thuyền 5 sao (2 đêm)',
      'Các bữa ăn theo chương trình (6 bữa)',
      'Vé tham quan các điểm du lịch',
      'Xe đưa đón Hà Nội - Hạ Long - Hà Nội',
      'Hướng dẫn viên tiếng Việt/Anh',
      'Kayak và thiết bị an toàn',
      'Bảo hiểm du lịch',
      'Nước uống trên xe và du thuyền'
    ],
    excluded: [
      'Đồ uống có cồn',
      'Chi phí cá nhân',
      'Tip cho hướng dẫn viên và lái xe',
      'Các dịch vụ không mentioned trong chương trình',
      'Vé máy bay/quốc tế'
    ],
    tags: ['halong', 'duthuyen', 'bien', 'UNESCO', 'caonguyen'],
    reviews: [
      {
        user: 'Nguyễn Thị Minh',
        rating: 5,
        comment: 'Tour tuyệt vời! Du thuyền rất sang trọng, đồ ăn ngon, hướng dẫn viên nhiệt tình. Cảnh đẹp không thể tả bằng lời, đặc biệt là lúc bình minh trên vịnh.',
        date: '2024-01-15'
      },
      {
        user: 'Trần Văn Hùng',
        rating: 4,
        comment: 'Trải nghiệm rất đáng giá. Hang Sửng Sốt đẹp ngoạn mục, kayak rất thú vị. Chỉ hơi tiếc là thời tiết không được đẹp lắm vào ngày thứ 2.',
        date: '2024-01-10'
      },
      {
        user: 'Lê Hoàng Anh',
        rating: 5,
        comment: 'Dịch vụ 5 sao! Từ đón tiếp, phục vụ đến hướng dẫn đều rất chuyên nghiệp. Sẽ giới thiệu cho bạn bè và quay lại vào năm sau.',
        date: '2024-01-08'
      }
    ],
    rating: {
      average: 4.7,
      count: 128
    }
  };

  // Set default selected date
  if (!selectedDate && tour.startDates.length > 0) {
    setSelectedDate(tour.startDates[0]);
  }

  const handleBookTour = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt tour");
      navigate("/login");
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    alert(`Đặt tour "${tour.title}" thành công!\nSố lượng: ${travelers} người\nNgày khởi hành: ${new Date(selectedDate).toLocaleDateString('vi-VN')}`);
    setShowBookingModal(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscountPercentage = () => {
    if (!tour.discountPrice || !tour.price) return 0;
    return Math.round(((tour.price - tour.discountPrice) / tour.price) * 100);
  };

  const handleTravelersChange = (amount) => {
    setTravelers(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="tour-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <div className="container">
          <Link to="/">Trang chủ</Link>
          <span className="separator">/</span>
          <Link to="/booking">Đặt tour</Link>
          <span className="separator">/</span>
          <span className="current">{tour.title}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <div className="tour-detail-content">
          {/* Image Gallery */}
          <section className="image-gallery-section">
            <div className="main-image">
              <img 
                src={tour.images[selectedImage]?.url || tour.images[0]?.url} 
                alt={tour.title}
              />
              {tour.discountPrice && (
                <div className="discount-badge">
                  -{calculateDiscountPercentage()}%
                </div>
              )}
            </div>
            <div className="thumbnail-grid">
              {tour.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.url} alt={`${tour.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          </section>

          {/* Tour Info & Booking */}
          <section className="tour-info-section">
            {/* Tour Header */}
            <div className="tour-header">
              <div className="tour-meta">
                <span className="category-badge">
                  {getCategoryIcon(tour.category)} {getCategoryName(tour.category)}
                </span>
                <span className="duration">
                  📅 {tour.duration} ngày {tour.duration - 1} đêm
                </span>
                <span className="rating">
                  ⭐ {tour.rating.average} ({tour.rating.count} đánh giá)
                </span>
              </div>
              
              <h1 className="tour-title">{tour.title}</h1>
              <p className="tour-location">📍 {tour.destination}</p>

              {/* Price Section */}
              <div className="price-section">
                {tour.discountPrice ? (
                  <>
                    <div className="discount-price">
                      {formatPrice(tour.discountPrice)}
                      <span className="price-unit">/người</span>
                    </div>
                    <div className="original-price">
                      {formatPrice(tour.price)}
                    </div>
                    <div className="save-amount">
                      Tiết kiệm {formatPrice(tour.price - tour.discountPrice)}
                    </div>
                  </>
                ) : (
                  <div className="normal-price">
                    {formatPrice(tour.price)}
                    <span className="price-unit">/người</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Booking Card */}
            <div className="booking-card">
              <h3>Đặt Tour Nhanh</h3>
              
              {/* Date Selection */}
              <div className="booking-field">
                <label>Ngày khởi hành</label>
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-select"
                >
                  {tour.startDates.map((date, index) => (
                    <option key={index} value={date}>
                      {new Date(date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travelers Selection */}
              <div className="booking-field">
                <label>Số lượng người</label>
                <div className="traveler-counter">
                  <button 
                    className="counter-btn"
                    onClick={() => handleTravelersChange(-1)}
                    disabled={travelers <= 1}
                  >
                    -
                  </button>
                  <span className="counter-value">{travelers}</span>
                  <button 
                    className="counter-btn"
                    onClick={() => handleTravelersChange(1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="total-price">
                <span>Tổng cộng:</span>
                <span className="amount">
                  {formatPrice((tour.discountPrice || tour.price) * travelers)}
                </span>
              </div>

              {/* Book Button */}
              <button 
                className="book-now-btn"
                onClick={handleBookTour}
              >
                🎫 Đặt Tour Ngay
              </button>

              <div className="booking-features">
                <div className="feature">
                  <span className="icon">✓</span>
                  <span>Xác nhận ngay lập tức</span>
                </div>
                <div className="feature">
                  <span className="icon">🛡️</span>
                  <span>Đảm bảo giá tốt nhất</span>
                </div>
                <div className="feature">
                  <span className="icon">📧</span>
                  <span>Nhận email xác nhận</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Tour Details Tabs */}
        <section className="tour-details-tabs">
          <div className="tab-headers">
            {['overview', 'itinerary', 'included', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`tab-header ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {getTabTitle(tab)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <h3>Giới Thiệu Tour</h3>
                <p className="tour-description">{tour.description}</p>
                
                {/* Highlights */}
                <div className="highlights-section">
                  <h4>Điểm Nổi Bật</h4>
                  <div className="highlights-grid">
                    {tour.highlights.map((highlight, index) => (
                      <div key={index} className="highlight-item">
                        <span className="highlight-icon">✨</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="tags-section">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {tour.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="tab-panel">
                <h3>Lịch Trình Chi Tiết</h3>
                <div className="itinerary-timeline">
                  {tour.itinerary.map((day, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker">
                        <span className="day-number">Ngày {index + 1}</span>
                      </div>
                      <div className="timeline-content">
                        <h4>{day.title}</h4>
                        <p>{day.description}</p>
                        {day.activities && (
                          <ul className="activities-list">
                            {day.activities.map((activity, activityIndex) => (
                              <li key={activityIndex}>{activity}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included/Excluded Tab */}
            {activeTab === 'included' && (
              <div className="tab-panel">
                <div className="included-excluded-grid">
                  {/* Included */}
                  <div className="included-section">
                    <h4>💰 Chi Phí Bao Gồm</h4>
                    <ul className="included-list">
                      {tour.included.map((item, index) => (
                        <li key={index}>
                          <span className="check-icon">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div className="excluded-section">
                    <h4>💸 Chi Phí Không Bao Gồm</h4>
                    <ul className="excluded-list">
                      {tour.excluded.map((item, index) => (
                        <li key={index}>
                          <span className="cross-icon">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Đánh Giá Từ Khách Hàng</h3>
                <div className="reviews-section">
                  {tour.reviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-avatar">
                            {review.user.charAt(0)}
                          </span>
                          <div>
                            <div className="reviewer-name">
                              {review.user}
                            </div>
                            <div className="review-date">
                              {new Date(review.date).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <p className="review-content">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="modal-header">
              <h3>Xác Nhận Đặt Tour</h3>
              <button 
                className="close-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="booking-summary">
                <h4>{tour.title}</h4>
                <div className="summary-details">
                  <div className="detail-item">
                    <span>Ngày khởi hành:</span>
                    <span>{new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="detail-item">
                    <span>Số lượng:</span>
                    <span>{travelers} người</span>
                  </div>
                  <div className="detail-item">
                    <span>Đơn giá:</span>
                    <span>{formatPrice(tour.discountPrice || tour.price)}</span>
                  </div>
                  <div className="detail-item total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice((tour.discountPrice || tour.price) * travelers)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowBookingModal(false)}
              >
                Hủy
              </button>
              <button 
                className="confirm-btn"
                onClick={handleConfirmBooking}
              >
                Xác Nhận Đặt Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    beach: '🏖️',
    mountain: '⛰️',
    adventure: '🧗',
    cultural: '🏯',
    city: '🏙️'
  };
  return icons[category] || '🌍';
};

const getCategoryName = (category) => {
  const names = {
    beach: 'Biển',
    mountain: 'Núi',
    adventure: 'Phiêu Lưu',
    cultural: 'Văn Hóa',
    city: 'Thành Phố'
  };
  return names[category] || 'Du Lịch';
};

const getTabTitle = (tab) => {
  const titles = {
    overview: 'Tổng Quan',
    itinerary: 'Lịch Trình',
    included: 'Dịch Vụ',
    reviews: 'Đánh Giá'
  };
  return titles[tab];
};

export default TourDetail;