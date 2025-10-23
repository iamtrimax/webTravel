import React from 'react'
import formatPrice from '../../helper/formatPrice';
import { Link } from 'react-router-dom';

const TourSection = ({searchQuery, setSearchQuery, categories, selectedCategory, setSelectedCategory, filteredTours, handleTourSelect}) => {
    return (
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
    )
}


export default TourSection