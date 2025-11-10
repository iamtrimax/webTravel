import formatPrice from "../../helper/formatPrice";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';


const DashboardOverview = ({ stats, monthlyData, dailyBookingsData }) => {

  // Hàm định dạng giá trị cho Trục Y (VND hoặc triệu VND)
  const yAxisFormatter = (value) => {
    if (value === 0) return '0 VND';
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} Tỷ`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} Triệu`;
    }
    return value.toLocaleString('vi-VN');
  };

  // Hàm định dạng giá trị cho Tooltip (Đầy đủ VND)
  const tooltipFormatter = (value, name) => {
    if (typeof value === 'number') {
      return [
        `${value.toLocaleString('vi-VN')} VND`,
        name === 'totalRevenue' ? 'Doanh Thu' : name
      ];
    }
    return [value, name];
  };

  // Xác định màu sắc cho phần trăm thay đổi
  const percentageColor = stats.percentageChange > 0
    ? '#00c851' // Xanh lá: Tăng
    : stats.percentageChange < 0
      ? '#ff4444' // Đỏ: Giảm
      : '#888'; // Xám: Không đổi

  return (
    <div className="dashboard-overview">

      {/* --- I. STATS GRID --- */}
      <div className="stats-grid">

        {/* 1. Doanh thu hôm nay */}
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Doanh thu hôm nay</h3>
            <p className="stat-value">{formatPrice(stats.dailyRevenue)}</p>
            <span
              className="stat-label"
              style={{ color: percentageColor, fontWeight: 'bold' }}
            >
              {/* Hiển thị phần trăm thay đổi so với hôm qua */}
              {stats.percentageChange > 0 ? '▲' : stats.percentageChange < 0 ? '▼' : '▬'}
              {Math.abs(stats.percentageChange)}% so với hôm qua
            </span>
          </div>
        </div>

        {/* 2. Đặt tour hôm nay */}
        <div className="stat-card bookings">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Đặt tour hôm nay</h3>
            <p className="stat-value">{stats.dailyBookings || 0}</p>
          </div>
        </div>

        {/* 3. Tổng người dùng */}
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Tổng người dùng</h3>
            <p className="stat-value">{stats.totalUsers || 0}</p>
          </div>
        </div>

        {/* 4. Email chưa đọc */}
        <div className="stat-card emails">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>Email chưa đọc</h3>
            <p className="stat-value">{stats.unreadEmails || 0}</p>
            <span className="stat-label">Cần phản hồi</span>
          </div>
        </div>
      </div>

      {/* --- II. CHARTS SECTION --- */}
      <div className="charts-section">

        {/* 1. Biểu đồ Doanh thu theo tháng */}
        <div className="chart-card">
          <h3>Doanh thu theo tháng (12 tháng gần nhất)</h3>
          {monthlyData && monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="label"
                  stroke="#888"
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis
                  stroke="#888"
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                  domain={[0, 'auto']} // Đảm bảo trục bắt đầu từ 0
                  tickFormatter={yAxisFormatter}
                />
                <Tooltip
                  formatter={tooltipFormatter}
                  contentStyle={{ background: '#2d2d2d', border: '1px solid #444', borderRadius: '5px', color: '#fff' }}
                />
                <Legend />
                <Bar
                  dataKey="totalRevenue"
                  name="Doanh Thu"
                  fill="#00d4ff" // Màu xanh neon
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">
              <p>Đang tải hoặc không có dữ liệu doanh thu hàng tháng để hiển thị.</p>
            </div>
          )}
        </div>

        {/* 2. Lượt đặt tour theo ngày (Placeholder) */}
        <div className="chart-card">
          <h3>Lượt đặt tour theo ngày (30 ngày gần nhất)</h3>
          {dailyBookingsData && dailyBookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyBookingsData}>
                <XAxis
                  dataKey="label"
                  stroke="#888"
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                />
                <YAxis
                  stroke="#888"
                  tickLine={false}
                  axisLine={{ stroke: '#333' }}
                  // Đảm bảo trục Y hiển thị số nguyên
                  tickFormatter={(value) => Math.round(value)}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ background: '#2d2d2d', border: '1px solid #444', color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone" // Đường cong mượt mà
                  dataKey="totalBookings"
                  name="Lượt Đặt"
                  stroke="#ffc107" // Màu vàng (đồng bộ với bookings trong CSS)
                  strokeWidth={3}
                  dot={false} // Ẩn các chấm tròn trên đường
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">
              <p>Đang tải hoặc không có dữ liệu lượt đặt tour hàng ngày.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;