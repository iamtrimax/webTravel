import { useEffect } from "react";
import { useState } from "react";
import BookingDetailModal from "../BookingDetailModal/BookingDetailModal";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: ''
  });

  // Sample data - thay thế bằng API thực tế
  const sampleBookings = [
    {
      id: 'BK001',
      tourId: 'T001',
      tourTitle: 'Tour Hà Nội - Sapa 3 ngày 2 đêm',
      customer: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0123456789'
      },
      bookingDate: '2024-01-15',
      travelDate: '2024-02-20',
      numberOfPeople: 2,
      totalPrice: 5000000,
      status: 'confirmed',
      paymentStatus: 'paid',
      specialRequests: 'Yêu cầu phòng đôi, ăn chay'
    },
    {
      id: 'BK002',
      tourId: 'T002',
      tourTitle: 'Tour Đà Nẵng - Hội An 4 ngày 3 đêm',
      customer: {
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0987654321'
      },
      bookingDate: '2024-01-16',
      travelDate: '2024-02-25',
      numberOfPeople: 4,
      totalPrice: 12000000,
      status: 'pending',
      paymentStatus: 'pending',
      specialRequests: ''
    },
    {
      id: 'BK003',
      tourId: 'T003',
      tourTitle: 'Tour Phú Quốc 5 ngày 4 đêm',
      customer: {
        name: 'Lê Văn C',
        email: 'levanc@gmail.com',
        phone: '0369852147'
      },
      bookingDate: '2024-01-17',
      travelDate: '2024-03-01',
      numberOfPeople: 3,
      totalPrice: 15000000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      specialRequests: 'Có trẻ em 5 tuổi'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(sampleBookings);
      setFilteredBookings(sampleBookings);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterBookings();
  }, [filters, bookings]);

  const filterBookings = () => {
    let result = bookings;

    if (filters.status !== 'all') {
      result = result.filter(booking => booking.status === filters.status);
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
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
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
                <td className="booking-id">{booking.id}</td>
                <td>
                  <div className="customer-info">
                    <strong>{booking.customer.name}</strong>
                    <div>{booking.customer.phone}</div>
                    <div>{booking.customer.email}</div>
                  </div>
                </td>
                <td className="tour-info">
                  <div className="tour-title">{booking.tourTitle}</div>
                  <div className="travel-date">Ngày đi: {booking.travelDate}</div>
                </td>
                <td>{booking.bookingDate}</td>
                <td className="text-center">{booking.numberOfPeople}</td>
                <td className="text-right">{formatPrice(booking.totalPrice)}</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>{getPaymentStatusBadge(booking.paymentStatus)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Chi tiết
                    </button>
                    {booking.status === 'pending' && (
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
                    {booking.status === 'confirmed' && (
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