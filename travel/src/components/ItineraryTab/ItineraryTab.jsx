import React from 'react'

const ItineraryTab = ({ tour }) => {
    return (
        <div className="tab-panel">
            <h3>Lịch Trình Chi Tiết</h3>
            <div className="itinerary-timeline">
                {tour?.itinerary.map((day, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-marker">
                            <span className="day-number">Ngày {index + 1}</span>
                        </div>
                        <div className="timeline-content">
                            <h4>{day.title}</h4>
                            <p>{day.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>)
}

export default ItineraryTab