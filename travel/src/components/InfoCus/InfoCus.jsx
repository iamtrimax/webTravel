import React from 'react'

const InfoCus = ({ customerInfo, handleCustomerInfoChange, isCustomerInfoValid, setActiveStep }) => {
  return (
        <section className="customer-info-section">
          <div className="container">
            <div className="customer-info-content">
              <h2>Thông Tin Khách Hàng</h2>
              <p className="section-description">Vui lòng cung cấp thông tin của bạn để hoàn tất đặt tour</p>

              <div className="customer-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullname">Họ và Tên *</label>
                    <input
                      type="text"
                      id="fullname"
                      value={customerInfo.fullname}
                      onChange={(e) => handleCustomerInfoChange('fullname', e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="phone">Số Điện Thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="address">Địa Chỉ *</label>
                    <input
                      type="text"
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ liên hệ"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="specialRequests">Yêu Cầu Đặc Biệt</label>
                    <textarea
                      id="specialRequests"
                      value={customerInfo.specialRequests}
                      onChange={(e) => handleCustomerInfoChange('specialRequests', e.target.value)}
                      placeholder="Nhập các yêu cầu đặc biệt (dị ứng thức ăn, yêu cầu ăn uống, yêu cầu phòng ở, v.v.)"
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>

                <div className="form-note">
                  <i className="fas fa-info-circle"></i>
                  Các trường có dấu * là bắt buộc
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="back-btn" onClick={() => setActiveStep(2)}>
                  <i className="fas fa-arrow-left"></i>
                  Quay Lại
                </button>
                <button
                  className="next-btn"
                  onClick={() => setActiveStep(4)}
                  disabled={!isCustomerInfoValid()}
                >
                  Tiếp Theo: Thanh Toán
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
  )
}

export default InfoCus