import React from 'react'
import StarRating from '../StarRating/StarRating'

const ReviewModal = ({ setShowReviewModal, tour, newReview, setNewReview, handleStarClick, handleSubmitReview }) => {
  return (
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
  )
}

export default ReviewModal