import { useEffect } from "react";
import { useState } from "react";
import BookingDetailModal from "../BookingDetailModal/BookingDetailModal";
import sumaryApi from "../../common";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    bookingStatus: 'all',
    search: '',
    dateRange: ''
  });

  // Sample data - thay thế bằng API thực tế

  const booking = async () => {
    const fetchBookings = await fetch(sumaryApi.allbooking.url, {
          method: sumaryApi.allbooking.method,
           headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
  })
      const data = await fetchBookings.json()
      if(data.success){
        console.log(data.data);
        
        setBookings(data.data)
        setFilteredBookings(data.data)
      }
  }
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      booking()
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filters, bookings]);

  const filterBookings = () => {
    let result = bookings;

    if (filters.bookingStatus !== 'all') {
      result = result.filter(booking => booking.bookingStatus === filters.bookingStatus);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(booking =>
        booking.customer.name.toLowerCase().includes(searchLower) ||
        booking.customer.email.toLowerCase().includes(searchLower) ||
        booking.customer.phone.includes(filters.search) ||
        booking.tourTitle.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      setLoading(false);
    }, 500);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Chờ xác nhận' },
      confirmed: { class: 'status-confirmed', text: 'Đã xác nhận' },
      cancelled: { class: 'status-cancelled', text: 'Đã hủy' },
      completed: { class: 'status-completed', text: 'Hoàn thành' }
    };

    const config = statusConfig[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'payment-pending', text: 'Chờ thanh toán' },
      paid: { class: 'payment-paid', text: 'Đã thanh toán' },
      refunded: { class: 'payment-refunded', text: 'Đã hoàn tiền' },
      failed: { class: 'payment-failed', text: 'Thanh toán lỗi' }
    };

    const config = statusConfig[status] || { class: 'payment-default', text: status };
    return <span className={`payment-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="booking-management loading">
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h1>Quản lý Đặt Tour</h1>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{bookings.length}</span>
            <span className="stat-label">Tổng đơn</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{bookings.filter(b => b.status === 'confirmed').length}</span>
            <span className="stat-label">Đã xác nhận</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{bookings.filter(b => b.status === 'pending').length}</span>
            <span className="stat-label">Chờ xác nhận</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại, tour..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.bookingStatus}
            onChange={(e) => handleFilterChange('bookingStatus', e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Mã đặt tour</th>
              <th>Khách hàng</th>
              <th>Tour</th>
              <th>Ngày đặt</th>
              <th>Số người</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td className="booking-id">{booking.idBooking}</td>
                <td>
                  <div className="customer-info">
                    <strong>{booking.fullname}</strong>
                    <div>{booking.phone}</div>
                    <div>{booking.email}</div>
                  </div>
                </td>
                <td className="tour-info">
                  <div className="tour-title">{booking?.tour?.title}</div>
                  <div className="travel-date">Ngày đi: {new Date(booking.bookingDate).toLocaleDateString()}</div>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td className="text-center">{booking.bookingSlots}</td>
                <td className="text-right">{formatPrice(booking.totalPrice)}</td>
                <td>{getStatusBadge(booking.bookingStatus)}</td>
                <td>{getPaymentStatusBadge(booking.payStatus)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Chi tiết
                    </button>
                    {booking.bookingStatus === 'pending' && (
                      <>
                        <button
                          className="btn-confirm"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          Xác nhận
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        className="btn-complete"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                      >
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="no-data">
            Không tìm thấy đơn đặt tour nào
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};
export default BookingManagement;