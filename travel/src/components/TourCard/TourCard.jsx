import { useState } from "react";
import logo2 from "../../assets/logo2.png";

const TourCard = ({ tour, onEdit, onDelete, onToggleStatus, getCategoryColor, getStatusColor }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDateUTC = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  // Giá trị mặc định nếu undefined
  const price = tour.price ?? 0;
  const discountPrice = tour.discountPrice ?? 0;
  const discountPercentage = tour.discountPercentage ?? 0;
  const duration = tour.duration ?? 0;
  const bookedSlots = tour.bookedSlots ?? 0;
  const totalSlots = tour.totalSlots ?? 0;
  const title = tour.title || "";
  const destination = tour.destination || "";
  const description = tour.description || "";
  const category = tour.category || "other";
  const isActive = tour.isActive ?? false;
  const rating = tour?.rating?.average ?? 0;
  const startDates = Array.isArray(tour.startDates) ? tour.startDates : [];
  const endDates = Array.isArray(tour.endDate) ? tour.endDate : [];

  let categoryName
  switch (category) {
    case "adventure":
      categoryName = "Phiêu lưu";
      break;
    case "cultural":
      categoryName = "Văn hoá";
      break

    case "beach":
      categoryName = "Bãi Biển";
      break;
    case "mountain":
      categoryName = "Núi";
      break;
    case "city":
      categoryName = "Thành phố";
      break;
    default:
      categoryName = "Phiêu lưu";
      break;
  }

  return (
    <div className="tour-card">
      <div className="tour-card-header">
        <div className="tour-image">
          <img src={tour?.images?.[0]?.url || logo2} alt={title} />
          <div className="tour-badges">
            <span className="category-badge" style={{ backgroundColor: getCategoryColor(category) }}>
              {categoryName}
            </span>
            <span className="status-badge" style={{ backgroundColor: getStatusColor(isActive) }}>
              {isActive ? "Kích hoạt" : "Ẩn"}
            </span>
          </div>
        </div>

        <div className="tour-info">
          <h3 className="tour-title">{title}</h3>
          <p className="tour-destination">📍 {destination}</p>
          <p className="tour-description">{description}</p>

          <div className="tour-details">
            <div className="detail-item">
              <span>⏱️ {duration} ngày</span>
              <span>👥 {bookedSlots}/{totalSlots} vé</span>
            </div>

            <div className="detail-item">
              <span className="original-price">{price.toLocaleString()} VND</span>
              {discountPrice > 0 && (
                <span className="discount-price">
                  {discountPrice.toLocaleString()} VND
                  <span className="discount-percent">({parseInt(discountPercentage).toFixed(0)}%)</span>
                </span>
              )}
            </div>

            <div className="detail-item">
              <span>⭐ {rating}/5</span>
              <span>
                📅 {startDates.length > 0
                  ? startDates.map((date, index) => (
                      <div key={index}>
                        {formatDateUTC(date)} → {formatDateUTC(endDates[index] || date)}
                      </div>
                    ))
                  : "Chưa có ngày"}
              </span>
            </div>
          </div>
        </div>

        <button className="action-toggle" onClick={() => setShowActions(!showActions)}>
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="tour-actions-menu">
          <button className="action-btn edit" onClick={() => onEdit(tour)}>
            ✏️ Chỉnh sửa
          </button>
          <button className="action-btn status" onClick={() => onToggleStatus(tour._id)}>
            {isActive ? "👁️ Ẩn tour" : "👁️ Hiện tour"}
          </button>
          <button className="action-btn delete" onClick={() => onDelete(tour._id)}>
            🗑️ Xoá tour
          </button>
        </div>
      )}
    </div>
  );
};

export default TourCard;
