import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './TourDetail.scss';
import sumaryApi from '../../common';
import { useReview } from '../../customHook/useReview';

const TourDetail = () => {
  console.log("tourrrrrrrr");

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [tour, setTour] = useState(null)
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const token = localStorage.getItem("accessToken");
  const { id } = useParams()
  const {
    reviews,
    loading,
    error,
    summary,
    addReview,
    refetch: refetchReviews
  } = useReview(id)
  console.log("id.....", id);

  const fetchTourDetail = async (tourId) => {
    try {
      const url = sumaryApi.getTourDetail.url.replace(":id", tourId);
      console.log("🌐 Gọi API:", url);

      const fetchRes = await fetch(url, {
        method: sumaryApi.getTourDetail.method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Trạng thái phản hồi:", fetchRes.status);

      const text = await fetchRes.text(); // đọc text thô
      console.log("🧾 Dữ liệu trả về:", text);

      const data = JSON.parse(text); // thử parse lại thủ công
      if (data.success) {
        setTour(data.data);
        console.log("✅ Tour đã set:", data.data);
      } else {
        console.error("❌ Lỗi từ API:", data.message || "Không có success");
      }
    } catch (err) {
      console.error("💥 Lỗi fetchTourDetail:", err);
    }
  };
  const handleBookTour = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt tour");
      navigate("/login");
      return;
    }

    // Chuyển đến trang booking với tourId và selectedDate
    navigate(`/booking?tourId=${tour?._id}&selectedDate=${selectedDate}`);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddReview = () => {

    if (!token) {
      alert("Bạn cần đăng nhập để viết đánh giá");
      navigate("/login");
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }
    try {
      await addReview(newReview.rating, newReview.comment)
      alert("Cảm ơn bạn đã đánh giá tour! Đánh giá của bạn đã được ghi nhận.");
      setNewReview({
        rating: 5,
        comment: '',
      });
      setShowReviewModal(false);
      if (summary) {
        setTour(prev => prev ? {
          ...prev,
          rating: {
            ...prev.rating,
            average: summary.averageRating,
            count: summary.totalRatings
          }
        } : prev);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi đánh giá: ' + error.message);
    }

  };

  const handleStarClick = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };



  const StarRating = ({ rating, onRatingChange, editable = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''} ${editable ? 'editable' : ''}`}
            onClick={() => editable && onRatingChange(star)}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };
  useEffect(() => {
    if (id) {
      fetchTourDetail(id);
    }
  }, [id]);
  useEffect(() => {
    if (tour?.startDates?.length > 0) {
      setSelectedDate(tour?.startDates[0]);
    }
  }, [tour]);
  return (
    <div className="tour-detail-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <div className="container">
          <Link to="/">Trang chủ</Link>
          <span className="separator">/</span>
          <Link to="/booking">Đặt tour</Link>
          <span className="separator">/</span>
          <span className="current">{tour?.title}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <div className="tour-detail-content">
          {/* Image Gallery */}
          <section className="image-gallery-section">
            <div className="main-image">
              <img
                src={tour?.images[selectedImage]?.url || tour?.images[0]?.url}
                alt={tour?.title}
              />
              {tour?.discountPrice && (
                <div className="discount-badge">
                  -{parseInt(tour?.discountPercentage)}%
                </div>
              )}
            </div>
            <div className="thumbnail-grid">
              {tour?.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.url} alt={`${tour?.title} ${index + 1}`} />
                </div>
              ))}
            </div>

            {/* Booking Section - ĐÃ CHUYỂN XUỐNG DƯỚI HÌNH ẢNH */}
            <div className="booking-section-left">
              {/* Ngày khởi hành - NẰM NGANG */}
              <div className="departure-dates-horizontal">
                <h4>Ngày khởi hành có sẵn:</h4>
                <div className="date-list-horizontal">
                  {tour?.startDates.map((date, index) => (
                    <div
                      key={index}
                      className={`date-item ${selectedDate === date ? 'selected' : ''}`}
                      onClick={() => handleDateSelect(date)}
                    >
                      {new Date(date).toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'numeric'
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút đặt tour */}
              <div className="booking-action-left">
                <button
                  className="book-tour-btn"
                  onClick={handleBookTour}
                >
                  🎫 Đặt Tour Ngay
                </button>
                <div className="booking-guarantee">
                  <div className="guarantee-item">
                    <span className="icon">✓</span>
                    <span>Xác nhận ngay lập tức</span>
                  </div>
                  <div className="guarantee-item">
                    <span className="icon">🛡️</span>
                    <span>Đảm bảo giá tốt nhất</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tour Info */}
          <section className="tour-info-section">
            {/* Tour Header */}
            <div className="tour-header">
              <div className="tour-meta">
                <span className="category-badge">
                  {getCategoryIcon(tour?.category)} {getCategoryName(tour?.category)}
                </span>
                <span className="duration">
                  📅 {tour?.duration} ngày {tour?.duration - 1} đêm
                </span>
                <span className="rating">
                  ⭐ {tour?.rating.average} ({tour?.rating.count} đánh giá)
                </span>
              </div>

              <h1 className="tour-title">{tour?.title}</h1>
              <p className="tour-location">📍 {tour?.destination}</p>

              {/* Price Section */}
              <div className="price-section">
                {tour?.discountPrice ? (
                  <>
                    <div className="discount-price">
                      {formatPrice(tour?.discountPrice)}
                      <span className="price-unit">/người</span>
                    </div>
                    <div className="original-price">
                      {formatPrice(tour?.price)}
                    </div>
                    <div className="save-amount">
                      Tiết kiệm {formatPrice(tour?.price - tour?.discountPrice)}
                    </div>
                  </>
                ) : (
                  <div className="normal-price">
                    {formatPrice(tour?.price)}
                    <span className="price-unit">/người</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Tour Details Tabs */}
        <section className="tour-details-tabs">
          <div className="tab-headers">
            {['overview', 'itinerary', 'inclusions', 'reviews'].map(tab => (
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
                <p className="tour-description">{tour?.description}</p>

                {/* Tags */}
                <div className="tags-section">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {tour?.tags.map((tag, index) => (
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
                  {tour?.itinerary.map((day, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker">
                        <span className="day-number">Ngày {index + 1}</span>
                      </div>
                      <div className="timeline-content">
                        <h4>{day.title}</h4>
                        <p>{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included/Excluded Tab */}
            {activeTab === 'inclusions' && (
              <div className="tab-panel">
                <div className="included-excluded-grid">
                  {/* Included */}
                  <div className="included-section">
                    <h4>💰 Chi Phí Bao Gồm</h4>
                    <ul className="included-list">
                      {tour?.inclusions.map((item, index) => (
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
                      {tour?.exclusions.map((item, index) => (
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
                <div className="reviews-header">
                  <h3>Đánh Giá Từ Khách Hàng</h3>
                  <button
                    className="add-review-btn"
                    onClick={handleAddReview}
                  >
                    ✏️ Viết Đánh Giá
                  </button>
                </div>

                {/* Rating Summary */}
                <div className="rating-summary">
                  <div className="overall-rating">
                    <div className="rating-score">{summary.average}</div>
                    <div className="rating-stars">
                      <StarRating rating={summary.average} />
                    </div>
                    <div className="rating-count">{summary.totalRatings || 0} đánh giá</div>
                  </div>

                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = summary.ratingBreakdown?.[star] || 0;
                      const percentage = summary.totalRatings > 0 ? (count / summary.totalRatings) * 100 : 0; return (
                        <div key={star} className="rating-bar">
                          <span className="star-label">{star} sao</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="bar-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-section">
                  {loading ? (
                    <div className="loading">Đang tải đánh giá...</div>
                  ) : error ? (
                    <div className="error">{error}</div>
                  ) : reviews.length === 0 ? (
                    <div className="no-reviews">Chưa có đánh giá nào</div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-avatar">
                              {review.avatar || review.userId.username.charAt(0)}
                            </span>
                            <div>
                              <div className="reviewer-name">{review.userId.username}</div>
                              <div className="review-date">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          </div>
                          <div className="review-rating">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <p className="review-content">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal review-modal">
            <div className="modal-header">
              <h3>Viết Đánh Giá</h3>
              <button
                className="close-btn"
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="review-form">
                <h4>Đánh giá tour: {tour?.title}</h4>

                {/* Star Rating */}
                <div className="rating-input">
                  <label>Đánh giá sao:</label>
                  <div className="star-rating-input">
                    <StarRating
                      rating={newReview.rating}
                      onRatingChange={handleStarClick}
                      editable={true}
                    />
                    <span className="rating-text">
                      {newReview.rating === 5 ? 'Tuyệt vời' :
                        newReview.rating === 4 ? 'Tốt' :
                          newReview.rating === 3 ? 'Bình thường' :
                            newReview.rating === 2 ? 'Tệ' : 'Rất tệ'}
                    </span>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="comment-input">
                  <label>Nhận xét của bạn:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({
                      ...prev,
                      comment: e.target.value
                    }))}
                    placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
                    rows="6"
                  />
                  <div className="character-count">
                    {newReview.comment.length}/500 ký tự
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowReviewModal(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-btn"
                onClick={handleSubmitReview}
              >
                Gửi Đánh Giá
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
    inclusions: 'Dịch Vụ',
    reviews: 'Đánh Giá'
  };
  return titles[tab];
};

export default TourDetail;