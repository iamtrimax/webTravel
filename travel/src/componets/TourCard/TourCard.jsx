import { useState } from "react";
import logo2 from "../../assets/logo2.png";

const TourCard = ({ tour, onEdit, onDelete, onToggleStatus, getCategoryColor, getStatusColor, calculateFinalPrice }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="tour-card">
      <div className="tour-card-header">
        <div className="tour-image">
          <img src={logo2} alt={tour.title} />
          <div className="tour-badges">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(tour.category) }}
            >
              {tour.category}
            </span>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(tour.status) }}
            >
              {tour.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="tour-info">
          <h3 className="tour-title">{tour.title}</h3>
          <p className="tour-destination">📍 {tour.destination}</p>
          <p className="tour-description">{tour.description}</p>
          
          <div className="tour-details">
            <div className="detail-item">
              <span>⏱️ {tour.duration} ngày</span>
              <span>👥 {tour.bookedSlots}/{tour.totalSlots} vé</span>
            </div>
            <div className="detail-item">
              <span className="original-price">{tour.price.toLocaleString()} VND</span>
              {tour.discount > 0 && (
                <span className="discount-price">
                  {calculateFinalPrice(tour.price, tour.discount).toLocaleString()} VND
                  <span className="discount-percent">(-{tour.discount}%)</span>
                </span>
              )}
            </div>
            <div className="detail-item">
              <span>⭐ {tour.rating}/5</span>
              <span>📅 {tour.startDate} to {tour.endDate}</span>
            </div>
          </div>
        </div>
        
        <button 
          className="action-toggle"
          onClick={() => setShowActions(!showActions)}
        >
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="tour-actions-menu">
          <button 
            className="action-btn edit"
            onClick={() => onEdit(tour)}
          >
            ✏️ Chỉnh sửa
          </button>
          <button 
            className="action-btn status"
            onClick={() => onToggleStatus(tour.id, tour.status)}
          >
            {tour.status === 'active' ? '👁️ Ẩn tour' : '👁️ Hiện tour'}
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(tour.id)}
          >
            🗑️ Xoá tour
          </button>
        </div>
      )}
    </div>
  );
};
export default TourCard;