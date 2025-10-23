import React from 'react'

const InclusionsTab = ({ tour }) => {
    return (
        <div className="tab-panel">
            <div className="included-excluded-grid">
                {/* Included */}
                <div className="included-section">
                    <h4>💰 Chi Phí Bao Gồm</h4>
                    <ul className="included-list">
                        {tour?.inclusions.map((item, index) => (
                            <li key={index}>
                                <span className="check-icon">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Excluded */}
                <div className="excluded-section">
                    <h4>💸 Chi Phí Không Bao Gồm</h4>
                    <ul className="excluded-list">
                        {tour?.exclusions.map((item, index) => (
                            <li key={index}>
                                <span className="cross-icon">✗</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>)
}

export default InclusionsTab