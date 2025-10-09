// MyTicketsModal.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyTicketsModal.scss';
import sumaryApi from '../../common';
import { toast } from 'react-toastify';
import socket from '../../Socket/Socket';

const MyTicketsModal = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const token = localStorage.getItem("accessToken")
  // State cho bookings data
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    bookingStatus: 'all',
    search: ''
  });

  // Fetch bookings từ API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(sumaryApi.getBookingByAccount.url, {
        method: sumaryApi.getBookingByAccount.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("lấy tour của tôi.........");


      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Lỗi khi tải dữ liệu vé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    socket.on("Booking status changed",()=>{
      fetchBookings()
    })

    return ()=>{
      socket.off("Booking status changed")
    }
  }, [socket]);

  useEffect(() => {
    filterBookings();
  }, [filters, bookings]);

  // Filter logic
  const filterBookings = () => {
    let result = bookings;

    if (filters.bookingStatus !== 'all') {
      result = result.filter(booking => booking.bookingStatus === filters.bookingStatus);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(booking =>
        booking.fullname?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.phone?.includes(filters.search) ||
        booking.tour?.title?.toLowerCase().includes(searchLower) ||
        booking.idBooking?.toLowerCase().includes(searchLower)
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

  // Hàm hủy vé
  const handleCancelTicket = async (bookingId) => {
    try {
      setLoading(true);
      const response = await fetch(sumaryApi.cancelBooking.url.replace(':id', bookingId), {
        method: sumaryApi.cancelBooking.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        // Update local state
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId ? { ...booking, bookingStatus: 'cancelled' } : booking
        ));
        setCancelConfirm(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Lỗi khi hủy vé');
    } finally {
      setLoading(false);
    }
  };

  // Format functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Đang cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Status functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'confirmed': return '#00c853';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#ff4444';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
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

  // Tính toán stats từ bookings data thực tế
  const bookingStats = {
    pending: bookings.filter(b => b.bookingStatus === 'pending').length,
    confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    completed: bookings.filter(b => b.bookingStatus === 'completed').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
    totalBookings: bookings.length
  };

  // Phân loại tickets data từ bookings
  const getTicketsByTab = () => {
    switch (activeTab) {
      case 'pending':
        return bookings.filter(booking => booking.bookingStatus === 'pending');
      case 'upcoming':
        return bookings.filter(booking =>
          booking.bookingStatus === 'confirmed' &&
          new Date(booking.bookingDate) > new Date()
        );
      case 'completed':
        return bookings.filter(booking =>
          booking.bookingStatus === 'completed' ||
          (booking.bookingStatus === 'confirmed' && new Date(booking.bookingDate) < new Date())
        );
      case 'cancelled':
        return bookings.filter(booking => booking.bookingStatus === 'cancelled');
      default:
        return filteredBookings;
    }
  };

  const currentTickets = getTicketsByTab();

  // Các hàm in vé và chia sẻ
  const handlePrintTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    const tourTitle = ticket.tour?.title || 'Tour du lịch';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vé ${ticket.idBooking}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .ticket { 
            background: white;
            border: 3px solid #000;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px dashed #000;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            color: #2c5aa0;
            font-size: 24px;
          }
          .header h2 {
            margin: 10px 0 0 0;
            color: #333;
            font-size: 18px;
          }
          .qr-code { 
            text-align: center; 
            margin: 20px 0;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 10px;
          }
          .info-section {
            margin: 15px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          .info-section p {
            margin: 8px 0;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .ticket { box-shadow: none; border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1>VÉ THAM QUAN DU LỊCH</h1>
            <h2>${tourTitle}</h2>
          </div>
          <div class="info-section">
            <p><strong>Mã vé:</strong> ${ticket.idBooking}</p>
            <p><strong>Khách hàng:</strong> ${ticket.fullname}</p>
            <p><strong>Ngày đi:</strong> ${formatDate(ticket.bookingDate)}</p>
            <p><strong>Số lượng:</strong> ${ticket.bookingSlots} người</p>
            <p><strong>Tổng tiền:</strong> ${formatPrice(ticket.totalPrice)}</p>
            <p><strong>Trạng thái:</strong> ${getStatusText(ticket.bookingStatus)}</p>
          </div>
          <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.idBooking}" 
                 alt="QR Code" width="150" height="150" />
            <p><strong>Quét mã để check-in</strong></p>
          </div>
          <div class="footer">
            Vé được in từ hệ thống TRAVEL - ${new Date().toLocaleDateString('vi-VN')}
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handleShareTicket = (ticket) => {
    const tourTitle = ticket.tour?.title || 'Tour du lịch';
    const shareText = `Tôi đã đặt tour ${tourTitle} qua TRAVEL. Mã vé: ${ticket.idBooking}`;

    if (navigator.share) {
      navigator.share({
        title: `Vé ${tourTitle}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {
        // Fallback nếu share bị hủy
        navigator.clipboard.writeText(shareText);
        toast.success('Đã sao chép thông tin vé vào clipboard!');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Đã sao chép thông tin vé vào clipboard!');
    }
  };

  const handleExportFile = () => {
    // Tạo nội dung file CSV
    const headers = ['Mã vé', 'Tour', 'Ngày đi', 'Số người', 'Tổng tiền', 'Trạng thái', 'Ngày đặt'];
    const csvContent = [
      headers.join(','),
      ...currentTickets.map(ticket => [
        ticket.idBooking,
        `"${ticket.tour?.title || 'Tour'}"`,
        formatDate(ticket.bookingDate),
        ticket.bookingSlots,
        ticket.totalPrice,
        getStatusText(ticket.bookingStatus),
        formatDate(ticket.createdAt)
      ].join(','))
    ].join('\n');

    // Tạo blob và download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ve-cua-toi-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất file thành công!');
  };

  if (loading) {
    return (
      <div className="my-tickets-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin vé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tickets-page">
      {/* Header Section */}
      <section className="tickets-header">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Vé của tôi</span>
            </div>
            <h1>Vé Của Tôi</h1>
            <p>Quản lý và theo dõi các tour du lịch của bạn</p>
          </div>
        </div>
      </section>

      {/* User Stats - SỬ DỤNG DỮ LIỆU THỰC TẾ */}
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
      </section>

      {/* Main Content */}
      <section className="tickets-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
              <nav className="sidebar-nav">
                <button
                  className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <i className="fas fa-clock"></i>
                  <span>Chờ xác nhận</span>
                  <span className="nav-badge">{bookingStats.pending}</span>
                </button>
                <button
                  className={`nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  <i className="fas fa-plane-departure"></i>
                  <span>Tour sắp tới</span>
                  <span className="nav-badge">{bookingStats.confirmed}</span>
                </button>
                <button
                  className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>Tour đã hoàn thành</span>
                  <span className="nav-badge">{bookingStats.completed}</span>
                </button>
                <button
                  className={`nav-item ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  <i className="fas fa-times-circle"></i>
                  <span>Tour đã hủy</span>
                  <span className="nav-badge">{bookingStats.cancelled}</span>
                </button>
              </nav>

              <div className="sidebar-help">
                <h4>📞 Cần hỗ trợ?</h4>
                <p>Liên hệ với chúng tôi để được giải đáp thắc mắc</p>
                <button className="support-btn" onClick={() => toast.info('Tính năng đang phát triển')}>
                  <i className="fas fa-headset"></i>
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
              {/* Search and Filters */}
              <div className="content-header ">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tour, mã vé, email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <div className="header-actions">
                  <button
                    className="action-btn download"
                    onClick={handleExportFile}
                    disabled={currentTickets.length === 0}
                  >
                    <i className="fas fa-download"></i>
                    Xuất file
                  </button>
                </div>
              </div>

              {/* Tickets List */}
              <div className="tickets-list">
                {currentTickets.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h3>Không tìm thấy vé nào</h3>
                    <p>
                      {activeTab === 'pending' ? 'Không có vé nào đang chờ xác nhận' :
                        activeTab === 'upcoming' ? 'Bạn chưa có tour nào sắp tới' :
                          activeTab === 'completed' ? 'Bạn chưa hoàn thành tour nào' :
                            'Bạn chưa hủy tour nào'}
                    </p>
                    <Link to="/tours" className="explore-btn">
                      <i className="fas fa-compass"></i>
                      Khám phá tour ngay
                    </Link>
                  </div>
                ) : (
                  currentTickets.map((ticket) => (
                    <div key={ticket._id} className="ticket-item">
                      <div className="ticket-image">
                        <img
                          src={ticket.tour?.images?.[0].url || '/default-tour.jpg'}
                          alt={ticket.tour?.title}
                          onError={(e) => {
                            e.target.src = '/default-tour.jpg';
                          }}
                        />
                        <div className="image-overlay">
                          <span className="tour-duration">{ticket.tour?.duration || '1 ngày'}</span>
                          <span className="tour-price">{formatPrice(ticket.totalPrice)}</span>
                        </div>
                      </div>

                      <div className="ticket-info">
                        <div className="ticket-header">
                          <div className="ticket-meta">
                            <span className="ticket-id">#{ticket.idBooking}</span>
                            {getStatusBadge(ticket.bookingStatus)}
                          </div>
                          <div className="ticket-actions">
                            <button
                              className="action-btn detail"
                              onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}
                            >
                              <i className="fas fa-info-circle"></i>
                              {selectedTicket?._id === ticket._id ? 'Thu gọn' : 'Chi tiết'}
                            </button>

                            {(ticket.bookingStatus === 'pending' || ticket.bookingStatus === 'confirmed') && (
                              <button
                                className="action-btn cancel"
                                onClick={() => setCancelConfirm(ticket)}
                              >
                                <i className="fas fa-times"></i>
                                Hủy vé
                              </button>
                            )}

                            {ticket.bookingStatus === 'confirmed' && (
                              <button
                                className="action-btn print"
                                onClick={() => handlePrintTicket(ticket)}
                              >
                                <i className="fas fa-print"></i>
                                In vé
                              </button>
                            )}

                            <button
                              className="action-btn share"
                              onClick={() => handleShareTicket(ticket)}
                            >
                              <i className="fas fa-share-alt"></i>
                              Chia sẻ
                            </button>
                          </div>
                        </div>

                        <h3 className="tour-name">{ticket.tour?.title || 'Tour du lịch'}</h3>

                        <div className="tour-details">
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-calendar-alt"></i>
                              Ngày đi:
                            </span>
                            <span className="detail-value">{formatDate(ticket.bookingDate)}</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-clock"></i>
                              Giờ khởi hành:
                            </span>
                            <span className="detail-value">7:30</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-users"></i>
                              Số lượng:
                            </span>
                            <span className="detail-value">{ticket.bookingSlots} người</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-wallet"></i>
                              Tổng tiền:
                            </span>
                            <span className="detail-value price">{formatPrice(ticket.totalPrice)}</span>
                          </div>

                          {ticket.bookingStatus === 'pending' && (
                            <div className="detail-group">
                              <span className="detail-label">
                                <i className="fas fa-hourglass-half"></i>
                                Ngày đặt:
                              </span>
                              <span className="detail-value confirmation-time">
                                {formatDate(ticket.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {selectedTicket?._id === ticket._id && (
                          <div className="ticket-expanded">
                            <div className="expanded-content">
                              <div className="detail-section">
                                <h4>📋 Thông tin chi tiết</h4>
                                <div className="detail-grid">
                                  <div className="detail-item">
                                    <label>Mã đặt tour:</label>
                                    <span>{ticket.idBooking}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Ngày đặt:</label>
                                    <span>{formatDate(ticket.createdAt)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Khách hàng:</label>
                                    <span>{ticket.fullname}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Email:</label>
                                    <span>{ticket.email}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Số điện thoại:</label>
                                    <span>{ticket.phone}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Điểm tập trung:</label>
                                    <span>{ticket.tour?.meetingPoint || 'Đang cập nhật'}</span>
                                  </div>
                                  <div className="detail-item full-width">
                                    <label>Chính sách hủy:</label>
                                    <span className="policy">
                                      Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {ticket.tour?.inclusions && ticket.tour.inclusions.length > 0 && (
                                <div className="includes-section">
                                  <h4>✅ Dịch vụ bao gồm</h4>
                                  <div className="includes-list">
                                    {ticket.tour.inclusions.map((item, index) => (
                                      <span key={index} className="include-item">
                                        <i className="fas fa-check"></i>
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {ticket.specialRequire && (
                                <div className="notes-section">
                                  <h4>📝 Yêu cầu đặc biệt</h4>
                                  <p>{ticket.specialRequire}</p>
                                </div>
                              )}

                              {ticket.bookingStatus === 'cancelled' && ticket.payStatus === 'refunded' && (
                                <div className="refund-section">
                                  <h4>💳 Thông tin hoàn tiền</h4>
                                  <div className="refund-info">
                                    <p><strong>Trạng thái:</strong> Đã hoàn tiền</p>
                                    <p><strong>Số tiền hoàn:</strong> {formatPrice(ticket.totalPrice)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <div className="modal-header">
              <h3>Xác nhận hủy vé</h3>
              <button
                className="close-btn"
                onClick={() => setCancelConfirm(null)}
                disabled={loading}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn hủy vé <strong>#{cancelConfirm.idBooking}</strong>?</p>
              <p className="tour-name">{cancelConfirm.tour?.title || 'Tour du lịch'}</p>
              <div className="cancellation-policy">
                <h4>Chính sách hủy vé:</h4>
                <p>Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn</p>
              </div>
              {cancelConfirm.bookingStatus === 'pending' && (
                <div className="pending-cancellation-info">
                  <p><strong>Lưu ý:</strong> Vé đang chờ xác nhận, việc hủy vé sẽ được xử lý ngay lập tức.</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setCancelConfirm(null)}
                disabled={loading}
              >
                Quay lại
              </button>
              <button
                className="btn-confirm"
                onClick={() => handleCancelTicket(cancelConfirm._id)}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsModal;