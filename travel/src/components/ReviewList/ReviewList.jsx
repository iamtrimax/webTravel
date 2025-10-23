import React from 'react'
import StarRating from '../StarRating/StarRating'
import { SlOptions } from 'react-icons/sl'

const ReviewList = ({ reviews, loading, error, currentUserId, handleToggleActions, activeActionId, handleDeleteReview }) => {
    return (
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

                            <div className="review-header-right">
                                <div className="review-rating">
                                    <StarRating rating={review.rating} />
                                </div>

                                {/* Nút ... chỉ hiển thị cho đánh giá của người dùng hiện tại */}
                                {review.userId._id === currentUserId && (
                                    <div className="review-actions">
                                        <button
                                            className="review-actions-toggle"
                                            onClick={() => handleToggleActions(review.id)}
                                        >
                                            <SlOptions />
                                        </button>

                                        {activeActionId === review.id && (
                                            <div className="review-actions-dropdown">
                                                <button
                                                    className="delete-review-btn"
                                                    onClick={() => handleDeleteReview(review.userId._id)}
                                                >
                                                    Xóa đánh giá
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="review-content">{review.comment}</p>
                    </div>
                ))
            )}
        </div>)
}

export default ReviewList