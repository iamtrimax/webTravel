import React from 'react'

const TicketStats = ({ bookingStats, setActiveTab }) => {
  return (
      <section className="user-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActiveTab('pending')}>
              <div className="stat-icon pending">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{bookingStats.pending}</span>
                <span className="stat-label">Chờ xác nhận</span>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('upcoming')}>
              <div className="stat-icon upcoming">
                <i className="fas fa-plane-departure"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{bookingStats.confirmed}</span>
                <span className="stat-label">Sắp tới</span>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('completed')}>
              <div className="stat-icon completed">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{bookingStats.completed}</span>
                <span className="stat-label">Đã hoàn thành</span>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('cancelled')}>
              <div className="stat-icon cancelled">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{bookingStats.cancelled}</span>
                <span className="stat-label">Đã hủy</span>
              </div>
            </div>
            <div className="stat-card total" onClick={() => setActiveTab("all")}>
              <div className="stat-icon total">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{bookingStats.totalBookings}</span>
                <span className="stat-label">Tổng số vé</span>
              </div>
            </div>
          </div>
        </div>
      </section>  )
}

export default TicketStats