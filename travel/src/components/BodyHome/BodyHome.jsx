import React, { useState, useEffect } from 'react';
import './Homebody.scss';
import formatPrice from '../../helper/formatPrice';
import sumaryApi from '../../common';
import { Link, useNavigate } from 'react-router-dom';
const HomeBody = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleTours, setVisibleTours] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [tours, setTours] = useState([])
  const [tourFeatures, setTourFeatures] = useState([])
  const tourCategories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'adventure', name: 'Phiêu lưu' },
    { id: 'cultural', name: 'Văn hóa' },
    { id: 'beach', name: 'Bãi biển' },
    { id: 'city', name: 'Thành phố' },
    { id: 'moutain', name: 'Núi' },


  ];
  const navigator = useNavigate()

  const filteredTours = tours.filter(tour =>
    activeFilter === 'all' || tour.type === activeFilter || tour.category === activeFilter
  );
  const fecthAllTour = async () => {
    const fetchRes = await fetch(sumaryApi.getAllTours.url, {
      method: sumaryApi.getAllTours.method,
      headers: {
        "content-type": "application"
      }
    })
    const res = await fetchRes.json()
    if (res.success) {
      setTours(res.data.filter(tour => tour.isActive))
      console.log(res.data);

    }
    else
      console.log(res.message);

  }
  const fecthTourTopRate = async () => {
    const fetchRes = await fetch(sumaryApi.getToursTopRated.url, {
      method: sumaryApi.getToursTopRated.method,
      headers: {
        "content-type": "application"
      }
    })
    const res = await fetchRes.json()
    if (res.success) {
      setTourFeatures(res.data)
      console.log(res.data);

    }
    else
      console.log(res.message);

  }
  const handleBookTour = (id) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt tour");
      navigator("/login");
      return;
    }

    // Chuyển đến trang booking với tourId và selectedDate
    navigator(`/booking?tourId=${id}`);
  };
  const loadMoreTours = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleTours(prev => Math.min(prev + 3, filteredTours.length));
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fecthTourTopRate()
    fecthAllTour()
  }, [])
  return (
    <main className="home-body">
      {/* Featured Tours Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Tour Nổi Bật</h2>
            <p className="section-subtitle">Khám phá những điểm đến tuyệt vời nhất</p>
          </div>

          <div className="featured-grid">
            {tourFeatures.map(tour => (
              <div key={tour._id} className="featured-card">
                <div className="card-image">
                  <img src={tour.images[0].url} alt={tour.title} />
                  <div className="card-badge">Nổi Bật</div>
                  <div className="card-overlay">
                    <button className="detail-btn" onClick={() => navigator(`/detail/${tour._id}`)}>👁️ Xem chi tiết</button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="tour-meta">
                    <span className="tour-duration">{`${tour.duration} ngày ${tour.duration - 1} đêm`}</span>
                    <span className="tour-rating">
                      ⭐ {tour.rating.average}
                    </span>
                  </div>
                  <h3 className="tour-name">{tour.title}</h3>
                  <p className="tour-location">📍 {tour.destination}</p>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-highlights">
                    {tour.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="highlight-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="tour-price">
                      <span className="price">{formatPrice(tour.discountPrice || tour.price)}</span>
                      <span className="price-note">/người</span>
                    </div>
                    <button className="book-now-btn" onClick={() => handleBookTour(tour._id)}>Đặt Ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tours Section */}
      <section className="tours-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Khám Phá Điểm Đến</h2>
            <p className="section-subtitle">Hơn 100+ tour du lịch đa dạng</p>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {tourCategories.map(category => (
              <button
                key={category.id}
                className={`filter-tab ${activeFilter === category.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Tours Grid */}
          <div className="tours-grid">
            {filteredTours.slice(0, visibleTours).map(tour => (
              <div key={tour.id} className="tour-card">
                <div className="card-image">
                  <img src={tour.images[0].url} alt={tour.image} />
                  <div className="card-overlay">
                    <button className="detail-btn" onClick={() => navigator(`/detail/${tour._id}`)}>👁️ Xem chi tiết</button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="tour-meta">
                    <span className="tour-duration">{`${tour.duration} ngày ${tour.duration - 1} đêm`}</span>
                    <span className="tour-rating">
                      ⭐ {tour.rating.average}
                    </span>
                  </div>
                  <h3 className="tour-name">{tour.title}</h3>
                  <p className="tour-location">📍 {tour.destination}</p>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-highlights">
                    {tour.tags.map((tag, index) => (
                      <span key={index} className="highlight-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="tour-price">
                      <span className="price">{formatPrice(tour.discountPrice || tour.price)}</span>
                      <span className="price-note">/người</span>
                    </div>
                    <button className="book-now-btn" onClick={() => handleBookTour(tour._id)}>Đặt Tour</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleTours < filteredTours.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={loadMoreTours}
                disabled={isLoading}
              >
                {isLoading ? 'Đang tải...' : 'Xem Thêm Tour'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🌎</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Điểm Đến</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">😊</div>
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Khách Hàng Hài Lòng</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Đánh Giá</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-number">15+</div>
              <div className="stat-label">Năm Kinh Nghiệm</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeBody;