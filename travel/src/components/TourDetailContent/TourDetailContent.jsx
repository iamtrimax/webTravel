import formatPrice from '../../helper/formatPrice'

const TourDetailContent = ({ tour, selectedImage, setSelectedImage, handleDateSelect, handleBookTour, selectedDate, getCategoryIcon, getCategoryName }) => {
  return (
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
                  {tour?.startDates.filter(date=> new Date(date)> new Date()).map((date, index) => (
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
        </div>  )
}

export default TourDetailContent