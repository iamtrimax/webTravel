const DashboardOverview = ({ stats }) => {
  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Doanh thu hôm nay</h3>
            <p className="stat-value">{stats.dailyRevenue.toLocaleString()} VND</p>
            <span className="stat-label">+12% so với hôm qua</span>
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Đặt tour hôm nay</h3>
            <p className="stat-value">{stats.dailyBookings}</p>
            <span className="stat-label">+5% so với hôm qua</span>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Tổng người dùng</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <span className="stat-label">Người dùng mới: 24</span>
          </div>
        </div>

        <div className="stat-card emails">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>Email chưa đọc</h3>
            <p className="stat-value">{stats.unreadEmails}</p>
            <span className="stat-label">Cần phản hồi</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Doanh thu theo tháng</h3>
          <div className="chart-placeholder">
            <p>Biểu đồ doanh thu sẽ được hiển thị tại đây</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Lượt đặt tour theo ngày</h3>
          <div className="chart-placeholder">
            <p>Biểu đồ lượt đặt tour sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;