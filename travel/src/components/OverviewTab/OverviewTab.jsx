import React from 'react'

const OverviewTab = ({tour, isExpanded, setIsExpanded}) => {
  return (
<div className="tab-panel">
                <h3>Giới Thiệu Tour</h3>
                <div className="tour-description-container">
                  <p className={`tour-description ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    {tour?.description}
                  </p>
                  {tour?.description && tour.description.length > 200 && (
                    <button
                      className="read-more-btn"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="tags-section">
                  <h4>Tags</h4>
                  <div className="tags-container">
                    {tour?.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>  )
}

export default OverviewTab