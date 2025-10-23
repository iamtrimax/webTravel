import React, { useState, useEffect } from 'react';
import './Homebody.scss';
import formatPrice from '../../helper/formatPrice';
const HomeBody = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleTours, setVisibleTours] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const tourCategories = [
    { id: 'all', name: 'Tất Cả' },
    { id: 'domestic', name: 'Trong Nước' },
    { id: 'international', name: 'Quốc Tế' },
    { id: 'adventure', name: 'Phiêu Lưu' },
    { id: 'cultural', name: 'Văn Hóa' },
    { id: 'beach', name: 'Biển Đảo' }
  ];

  const tours = [
    {
      id: 1,
      name: 'Phố Cổ Hội An - Di Sản Văn Hóa',
      location: 'Hội An, Quảng Nam',
      category: 'cultural',
      type: 'domestic',
      price: 2490000,
      duration: '3 ngày 2 đêm',
      rating: 4.8,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Khám phá vẻ đẹp cổ kính của phố cổ Hội An với những con đường rực rỡ đèn lồng, những ngôi nhà gỗ hàng trăm năm tuổi và ẩm thực đặc sắc miền Trung.',
      highlights: ['Đèn lồng Hội An', 'Chùa Cầu', 'Ẩm thực phố cổ', 'Làng rau Trà Quế'],
      featured: true
    },
    {
      id: 2,
      name: 'Vịnh Hạ Long - Kỳ Quan Thiên Nhiên',
      location: 'Quảng Ninh',
      category: 'adventure',
      type: 'domestic',
      price: 3890000,
      duration: '2 ngày 1 đêm',
      rating: 4.9,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1575381813691-465c8eac364e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Trải nghiệm du thuyền sang trọng khám phá vịnh Hạ Long - di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi hùng vĩ.',
      highlights: ['Du thuyền 5 sao', 'Hang Sửng Sốt', 'Kayaking', 'Sun World Ha Long'],
      featured: true
    },
    {
      id: 3,
      name: 'Bangkok - Kinh Đô Châu Á',
      location: 'Thái Lan',
      category: 'cultural',
      type: 'international',
      price: 8990000,
      duration: '5 ngày 4 đêm',
      rating: 4.7,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1558769132-cb1aedeffa2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Hòa mình vào nhịp sống sôi động của Bangkok, khám phá những ngôi chùa vàng lộng lẫy và thưởng thức ẩm thực đường phố nổi tiếng.',
      highlights: ['Chùa Wat Arun', 'Chatuchak Market', 'Chao Phraya Cruise', 'Khao San Road']
    },
    {
      id: 4,
      name: 'Đà Lạt - Thành Phố Ngàn Hoa',
      location: 'Lâm Đồng',
      category: 'cultural',
      type: 'domestic',
      price: 3190000,
      duration: '4 ngày 3 đêm',
      rating: 4.6,
      reviews: 1567,
      image: 'https://images.unsplash.com/photo-1596199050104-6e5a2a5c4b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Đắm chìm trong không khí se lạnh của Đà Lạt, thành phố ngàn hoa với những đồi thông, vườn hoa và kiến trúc Pháp cổ kính.',
      highlights: ['Thung lũng Tình Yêu', 'Hồ Xuân Hương', 'Biệt điện Bảo Đại', 'Chợ đêm Đà Lạt']
    },
    {
      id: 5,
      name: 'Bali - Thiên Đường Nhiệt Đới',
      location: 'Indonesia',
      category: 'beach',
      type: 'international',
      price: 12990000,
      duration: '6 ngày 5 đêm',
      rating: 4.9,
      reviews: 1789,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Trải nghiệm thiên đường nhiệt đới Bali với những bãi biển tuyệt đẹp, văn hóa độc đáo và resort sang trọng bậc nhất.',
      highlights: ['Kuta Beach', 'Uluwatu Temple', 'Tegallalang Rice Terrace', 'Ubud Art Market'],
      featured: true
    },
    {
      id: 6,
      name: 'Phú Quốc - Đảo Ngọc',
      location: 'Kiên Giang',
      category: 'beach',
      type: 'domestic',
      price: 4590000,
      duration: '4 ngày 3 đêm',
      rating: 4.7,
      reviews: 1345,
      image: 'https://images.unsplash.com/photo-1599643478510-a6d6a6d31de4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Thư giãn tại đảo ngọc Phú Quốc với những bãi biển cát trắng, làng chài xinh đẹp và hệ sinh thái biển phong phú.',
      highlights: ['Bãi Sao', 'VinWonders', 'Suối Tranh', 'Làng chài Hàm Ninh']
    },
    {
      id: 7,
      name: 'Tokyo - Thành Phố Tương Lai',
      location: 'Nhật Bản',
      category: 'cultural',
      type: 'international',
      price: 25990000,
      duration: '7 ngày 6 đêm',
      rating: 4.8,
      reviews: 945,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Khám phá sự kết hợp hoàn hảo giữa truyền thống và hiện đại tại Tokyo, thành phố không bao giờ ngủ.',
      highlights: ['Shibuya Crossing', 'Asakusa Temple', 'Tokyo Skytree', 'Harajuku Fashion']
    },
    {
      id: 8,
      name: 'Sapa - Nóc Nhà Đông Dương',
      location: 'Lào Cai',
      category: 'adventure',
      type: 'domestic',
      price: 2890000,
      duration: '3 ngày 2 đêm',
      rating: 4.5,
      reviews: 876,
      image: 'https://images.unsplash.com/photo-1552465016-bf2284a6a5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      description: 'Chinh phục Fansipan - nóc nhà Đông Dương và khám phá vẻ đẹp hùng vĩ của ruộng bậc thang Sapa.',
      highlights: ['Fansipan Peak', 'Bản Cát Cát', 'Thung lũng Mường Hoa', 'Chợ tình Sapa']
    }
  ];

  const filteredTours = tours.filter(tour => 
    activeFilter === 'all' || tour.type === activeFilter || tour.category === activeFilter
  );

  const loadMoreTours = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleTours(prev => Math.min(prev + 3, filteredTours.length));
      setIsLoading(false);
    }, 800);
  };


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
            {tours.filter(tour => tour.featured).map(tour => (
              <div key={tour.id} className="featured-card">
                <div className="card-image">
                  <img src={tour.image} alt={tour.name} />
                  <div className="card-badge">Nổi Bật</div>
                  <div className="card-overlay">
                    <button className="quick-view-btn">Xem Nhanh</button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="tour-meta">
                    <span className="tour-duration">{tour.duration}</span>
                    <span className="tour-rating">
                      ⭐ {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <h3 className="tour-name">{tour.name}</h3>
                  <p className="tour-location">📍 {tour.location}</p>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-highlights">
                    {tour.highlights.slice(0, 2).map((highlight, index) => (
                      <span key={index} className="highlight-tag">{highlight}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="tour-price">
                      <span className="price">{formatPrice(tour.price)}</span>
                      <span className="price-note">/người</span>
                    </div>
                    <button className="book-now-btn">Đặt Ngay</button>
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
                  <img src={tour.image} alt={tour.name} />
                  <div className="card-badge">{tour.type === 'domestic' ? 'Trong Nước' : 'Quốc Tế'}</div>
                  <div className="card-overlay">
                    <button className="quick-view-btn">❤️ Yêu thích</button>
                    <button className="detail-btn">👁️ Xem chi tiết</button>
                  </div>
                </div>
                <div className="card-content">
                  <div className="tour-meta">
                    <span className="tour-duration">{tour.duration}</span>
                    <span className="tour-rating">
                      ⭐ {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <h3 className="tour-name">{tour.name}</h3>
                  <p className="tour-location">📍 {tour.location}</p>
                  <p className="tour-description">{tour.description}</p>
                  <div className="tour-highlights">
                    {tour.highlights.map((highlight, index) => (
                      <span key={index} className="highlight-tag">{highlight}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <div className="tour-price">
                      <span className="price">{formatPrice(tour.price)}</span>
                      <span className="price-note">/người</span>
                    </div>
                    <button className="book-now-btn">Đặt Tour</button>
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