import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './TourDetail.scss';
import sumaryApi from '../../common';
import { useReview } from '../../customHook/useReview';
import { jwtDecode } from 'jwt-decode';
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import ReviewList from '../../components/ReviewList/ReviewList';
import RatingSummary from '../../components/RatingSummary/RatingSummary';
import InclusionsTab from '../../components/InclusionsTab/InclusionsTab';
import ItineraryTab from '../../components/ItineraryTab/ItineraryTab';
import OverviewTab from '../../components/OverviewTab/OverviewTab';
import TourDetailContent from '../../components/TourDetailContent/TourDetailContent';

const TourDetail = () => {
  console.log("tourrrrrrrr");

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [tour, setTour] = useState(null)
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeActionId, setActiveActionId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
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
  const handleToggleActions = (reviewId) => {
    setActiveActionId(activeActionId === reviewId ? null : reviewId);
  };
  const handleDeleteReview = async (userId) => {
    try {
      // Gọi API xóa đánh giá
      const fetchDelete = await fetch(sumaryApi.deleteReview.url.replace(":id", id).replace(":userId", userId), {
        method: sumaryApi.deleteReview.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await fetchDelete.json();
      if (data.success) {
        refetchReviews();
      } else {
        const errorData = await fetchDelete.json();
        throw new Error(errorData.message || 'Xóa đánh giá thất bại');
      }

      // Ẩn dropdown
      setActiveActionId(null);

      // Reload reviews hoặc xóa khỏi state
      // fetchReviews(); // hoặc
      // setReviews(reviews.filter(review => review.id !== reviewId));

    } catch (error) {
      console.error('Lỗi khi xóa đánh giá:', error);
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    setCurrentUserId(jwtDecode(token)?.id || null);
    const handleClickOutside = (event) => {
      if (!event.target.closest('.review-actions')) {
        setActiveActionId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);





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
        <TourDetailContent
          tour={tour}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleDateSelect={handleDateSelect}
          handleBookTour={handleBookTour}
          selectedDate={selectedDate}
          getCategoryIcon={getCategoryIcon}
          getCategoryName={getCategoryName}
        />

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
              <OverviewTab tour={tour} isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <ItineraryTab tour={tour} />
            )}

            {/* Included/Excluded Tab */}
            {activeTab === 'inclusions' && (
              <InclusionsTab tour={tour} />
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

                <RatingSummary summary={summary} />
                {/* Reviews List */}
                <ReviewList
                  reviews={reviews}
                  loading={loading}
                  error={error}
                  currentUserId={currentUserId}
                  handleToggleActions={handleToggleActions}
                  activeActionId={activeActionId}
                  handleDeleteReview={handleDeleteReview}
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          setShowReviewModal={setShowReviewModal}
          tour={tour}
          newReview={newReview}
          setNewReview={setNewReview}
          handleStarClick={handleStarClick}
          handleSubmitReview={handleSubmitReview}
        />
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