import React from 'react'
import StarRating from '../StarRating/StarRating';

const RatingSummary = ({ summary }) => {
  return (
<div className="rating-summary">
                  <div className="overall-rating">
                    <div className="rating-score">{summary.average}</div>
                    <div className="rating-stars">
                      <StarRating rating={summary.average} />
                    </div>
                    <div className="rating-count">{summary.totalRatings || 0} đánh giá</div>
                  </div>

                  <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = summary.ratingBreakdown?.[star] || 0;
                      const percentage = summary.totalRatings > 0 ? (count / summary.totalRatings) * 100 : 0; return (
                        <div key={star} className="rating-bar">
                          <span className="star-label">{star} sao</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="bar-count">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>  )
}

export default RatingSummary