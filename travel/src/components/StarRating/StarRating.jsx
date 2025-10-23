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
  export default StarRating