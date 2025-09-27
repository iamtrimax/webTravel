// MyTicketsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyTicketsModal.scss';

const MyTicketsModal = ({ user }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(null);

  // Mock data - Thay thế bằng API call thực tế
  const ticketsData = {
    upcoming: [
      {
        id: 'TK001',
        tourName: 'Phố Cổ Hội An - Di Sản Văn Hóa Thế Giới',
        date: '2024-03-20',
        time: '07:30',
        duration: '3 ngày 2 đêm',
        travelers: 2,
        totalAmount: 4980000,
        status: 'confirmed',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK001',
        bookingDate: '2024-03-10',
        meetingPoint: 'Sân bay Quảng Nam - 07:00',
        guide: 'Nguyễn Văn A - 0909123456',
        includes: ['Khách sạn 4*', 'Ăn sáng', 'Hướng dẫn viên', 'Bảo hiểm du lịch', 'Vé tham quan'],
        notes: 'Mang theo CMND/Passport, trang phục thoải mái, giày thể thao',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        cancellationPolicy: 'Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn'
      },
      {
        id: 'TK002',
        tourName: 'Vịnh Hạ Long - Kỳ Quan Thiên Nhiên Thế Giới',
        date: '2024-04-15',
        time: '08:00',
        duration: '2 ngày 1 đêm',
        travelers: 1,
        totalAmount: 3890000,
        status: 'confirmed',
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK002',
        bookingDate: '2024-03-12',
        meetingPoint: 'Bến tàu Tuần Châu - 07:30',
        guide: 'Trần Thị B - 0909987654',
        includes: ['Du thuyền 3 sao', 'Ăn uống đầy đủ', 'Kayaking', 'Bảo hiểm', 'Xe đưa đón'],
        notes: 'Mang theo đồ bơi, kem chống nắng, thuốc chống say sóng',
        image: 'https://images.unsplash.com/photo-1575381813691-465c8eac364e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        cancellationPolicy: 'Hủy trước 5 ngày: hoàn 100% | Trước 2 ngày: hoàn 70% | Dưới 2 ngày: không hoàn'
      }
    ],
    completed: [
      {
        id: 'TK003',
        tourName: 'Đà Lạt - Thành Phố Ngàn Hoa',
        date: '2024-02-15',
        time: '06:00',
        duration: '4 ngày 3 đêm',
        travelers: 3,
        totalAmount: 9570000,
        status: 'completed',
        rating: 4.5,
        review: 'Tour tuyệt vời, hướng dẫn viên nhiệt tình, cảnh quan đẹp. Khách sạn tiện nghi, ăn uống ngon miệng. Rất đáng trải nghiệm!',
        image: 'https://images.unsplash.com/photo-1596199050104-6e5a2a5c4b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        canReview: true
      },
      {
        id: 'TK004',
        tourName: 'Phú Quốc - Đảo Ngọc Phương Nam',
        date: '2024-01-10',
        time: '09:00',
        duration: '5 ngày 4 đêm',
        travelers: 2,
        totalAmount: 12500000,
        status: 'completed',
        rating: 4.2,
        review: 'Biển đẹp, đồ ăn hải sản tươi ngon. Dịch vụ tốt, đáng đồng tiền.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        canReview: false
      }
    ],
    cancelled: [
      {
        id: 'TK005',
        tourName: 'Sapa - Đỉnh Fansipan Nóc Nhà Đông Dương',
        date: '2024-01-20',
        time: '05:30',
        duration: '3 ngày 2 đêm',
        travelers: 2,
        totalAmount: 5980000,
        status: 'cancelled',
        reason: 'Thời tiết xấu',
        refundStatus: 'completed',
        refundAmount: 5980000,
        cancellationDate: '2024-01-15',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
      }
    ]
  };

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#00c853';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#ff4444';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const handleCancelTicket = (ticketId) => {
    // Simulate API call để hủy vé
    console.log('Hủy vé:', ticketId);
    setCancelConfirm(null);
    // Sau khi hủy thành công, có thể reload data hoặc update state
  };

  const handlePrintTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Vé ${ticket.id}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 20px; 
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
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>VÉ THAM QUAN DU LỊCH</h1>
              <h2>${ticket.tourName}</h2>
            </div>
            <div class="info-section">
              <p><strong>Mã vé:</strong> ${ticket.id}</p>
              <p><strong>Ngày đi:</strong> ${formatDate(ticket.date)}</p>
              <p><strong>Giờ khởi hành:</strong> ${ticket.time}</p>
              <p><strong>Số lượng:</strong> ${ticket.travelers} người</p>
              <p><strong>Tổng tiền:</strong> ${formatPrice(ticket.totalAmount)}</p>
            </div>
            <div class="qr-code">
              <img src="${ticket.qrCode}" alt="QR Code" width="150" height="150" />
              <p><strong>Quét mã để check-in</strong></p>
            </div>
            <p style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
              Vé được in từ hệ thống TRAVEL - ${new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareTicket = (ticket) => {
    if (navigator.share) {
      navigator.share({
        title: `Vé ${ticket.tourName}`,
        text: `Tôi đã đặt tour ${ticket.tourName} qua TRAVEL. Mã vé: ${ticket.id}`,
        url: window.location.href,
      });
    } else {
      // Fallback cho trình duyệt không hỗ trợ Web Share API
      navigator.clipboard.writeText(`Mã vé: ${ticket.id} - Tour: ${ticket.tourName}`);
      alert('Đã sao chép thông tin vé vào clipboard!');
    }
  };

  const filteredTickets = ticketsData[activeTab].filter(ticket =>
    ticket.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* User Stats */}
      <section className="user-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActiveTab('upcoming')}>
              <div className="stat-icon upcoming">
                <i className="fas fa-plane-departure"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{ticketsData.upcoming.length}</span>
                <span className="stat-label">Sắp tới</span>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('completed')}>
              <div className="stat-icon completed">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{ticketsData.completed.length}</span>
                <span className="stat-label">Đã hoàn thành</span>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveTab('cancelled')}>
              <div className="stat-icon cancelled">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{ticketsData.cancelled.length}</span>
                <span className="stat-label">Đã hủy</span>
              </div>
            </div>
            <div className="stat-card total">
              <div className="stat-icon total">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  {ticketsData.upcoming.length + ticketsData.completed.length + ticketsData.cancelled.length}
                </span>
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
              <div className="user-profile">
                <div className="profile-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="profile-info">
                  <h3>{user?.username || 'Khách hàng'}</h3>
                  <p>{user?.email || 'user@example.com'}</p>
                  <span className="member-level">Thành viên Vàng</span>
                </div>
              </div>

              <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  <i className="fas fa-plane-departure"></i>
                  <span>Tour sắp tới</span>
                  <span className="nav-badge">{ticketsData.upcoming.length}</span>
                </button>
                <button 
                  className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>Tour đã hoàn thành</span>
                  <span className="nav-badge">{ticketsData.completed.length}</span>
                </button>
                <button 
                  className={`nav-item ${activeTab === 'cancelled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cancelled')}
                >
                  <i className="fas fa-times-circle"></i>
                  <span>Tour đã hủy</span>
                  <span className="nav-badge">{ticketsData.cancelled.length}</span>
                </button>
              </nav>

              <div className="sidebar-help">
                <h4>📞 Cần hỗ trợ?</h4>
                <p>Liên hệ với chúng tôi để được giải đáp thắc mắc</p>
                <button className="support-btn">
                  <i className="fas fa-headset"></i>
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
              {/* Search and Filters */}
              <div className="content-header">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tour hoặc mã vé..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="header-actions">
                  <button className="action-btn print-all">
                    <i className="fas fa-print"></i>
                    In tất cả
                  </button>
                  <button className="action-btn download">
                    <i className="fas fa-download"></i>
                    Xuất file
                  </button>
                </div>
              </div>

              {/* Tickets List */}
              <div className="tickets-list">
                {filteredTickets.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h3>Không tìm thấy vé nào</h3>
                    <p>{
                      activeTab === 'upcoming' ? 'Bạn chưa có tour nào sắp tới' :
                      activeTab === 'completed' ? 'Bạn chưa hoàn thành tour nào' :
                      'Bạn chưa hủy tour nào'
                    }</p>
                    <Link to="/booking" className="explore-btn">
                      <i className="fas fa-compass"></i>
                      Khám phá tour ngay
                    </Link>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-image">
                        <img src={ticket.image} alt={ticket.tourName} />
                        <div className="image-overlay">
                          <span className="tour-duration">{ticket.duration}</span>
                          <span className="tour-price">{formatPrice(ticket.totalAmount)}</span>
                        </div>
                      </div>
                      
                      <div className="ticket-info">
                        <div className="ticket-header">
                          <div className="ticket-meta">
                            <span className="ticket-id">#{ticket.id}</span>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(ticket.status) }}
                            >
                              {getStatusText(ticket.status)}
                            </span>
                          </div>
                          <div className="ticket-actions">
                            <button 
                              className="action-btn detail"
                              onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                            >
                              <i className="fas fa-info-circle"></i>
                              {selectedTicket?.id === ticket.id ? 'Thu gọn' : 'Chi tiết'}
                            </button>
                            
                            {ticket.status === 'confirmed' && (
                              <button 
                                className="action-btn cancel"
                                onClick={() => setCancelConfirm(ticket)}
                              >
                                <i className="fas fa-times"></i>
                                Hủy vé
                              </button>
                            )}
                            
                            <button 
                              className="action-btn print"
                              onClick={() => handlePrintTicket(ticket)}
                            >
                              <i className="fas fa-print"></i>
                              In vé
                            </button>
                            <button 
                              className="action-btn share"
                              onClick={() => handleShareTicket(ticket)}
                            >
                              <i className="fas fa-share-alt"></i>
                              Chia sẻ
                            </button>
                          </div>
                        </div>

                        <h3 className="tour-name">{ticket.tourName}</h3>
                        
                        <div className="tour-details">
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-calendar-alt"></i>
                              Ngày đi:
                            </span>
                            <span className="detail-value">{formatDate(ticket.date)}</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-clock"></i>
                              Giờ khởi hành:
                            </span>
                            <span className="detail-value">{ticket.time}</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-users"></i>
                              Số lượng:
                            </span>
                            <span className="detail-value">{ticket.travelers} người</span>
                          </div>
                          <div className="detail-group">
                            <span className="detail-label">
                              <i className="fas fa-wallet"></i>
                              Tổng tiền:
                            </span>
                            <span className="detail-value price">{formatPrice(ticket.totalAmount)}</span>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedTicket?.id === ticket.id && (
                          <div className="ticket-expanded">
                            <div className="expanded-content">
                              <div className="detail-section">
                                <h4>📋 Thông tin chi tiết</h4>
                                <div className="detail-grid">
                                  <div className="detail-item">
                                    <label>Ngày đặt:</label>
                                    <span>{formatDate(ticket.bookingDate)}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Điểm tập trung:</label>
                                    <span>{ticket.meetingPoint}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Hướng dẫn viên:</label>
                                    <span>{ticket.guide}</span>
                                  </div>
                                  {ticket.cancellationPolicy && (
                                    <div className="detail-item">
                                      <label>Chính sách hủy:</label>
                                      <span className="policy">{ticket.cancellationPolicy}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {ticket.includes && (
                                <div className="includes-section">
                                  <h4>✅ Dịch vụ bao gồm</h4>
                                  <div className="includes-list">
                                    {ticket.includes.map((item, index) => (
                                      <span key={index} className="include-item">
                                        <i className="fas fa-check"></i>
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {ticket.notes && (
                                <div className="notes-section">
                                  <h4>📝 Lưu ý quan trọng</h4>
                                  <p>{ticket.notes}</p>
                                </div>
                              )}

                              {ticket.rating && (
                                <div className="rating-section">
                                  <h4>⭐ Đánh giá của bạn</h4>
                                  <div className="rating">
                                    <div className="stars">
                                      {'★'.repeat(Math.floor(ticket.rating))}
                                      {'☆'.repeat(5 - Math.floor(ticket.rating))}
                                      <span>({ticket.rating}/5)</span>
                                    </div>
                                    <p className="review">{ticket.review}</p>
                                    {ticket.canReview && (
                                      <button className="edit-review-btn">
                                        <i className="fas fa-edit"></i>
                                        Chỉnh sửa đánh giá
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              {ticket.refundStatus && (
                                <div className="refund-section">
                                  <h4>💳 Thông tin hoàn tiền</h4>
                                  <div className="refund-info">
                                    <p><strong>Lý do hủy:</strong> {ticket.reason}</p>
                                    <p><strong>Ngày hủy:</strong> {formatDate(ticket.cancellationDate)}</p>
                                    <p><strong>Trạng thái:</strong> 
                                      <span className={`refund-status ${ticket.refundStatus}`}>
                                        {ticket.refundStatus === 'completed' ? 'Đã hoàn tiền' : 'Đang xử lý'}
                                      </span>
                                    </p>
                                    <p><strong>Số tiền hoàn:</strong> {formatPrice(ticket.refundAmount)}</p>
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
              <button className="close-btn" onClick={() => setCancelConfirm(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>Bạn có chắc chắn muốn hủy vé <strong>#{cancelConfirm.id}</strong>?</p>
              <p className="tour-name">{cancelConfirm.tourName}</p>
              <div className="cancellation-policy">
                <h4>Chính sách hủy vé:</h4>
                <p>{cancelConfirm.cancellationPolicy}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setCancelConfirm(null)}>
                Quay lại
              </button>
              <button 
                className="btn-confirm" 
                onClick={() => handleCancelTicket(cancelConfirm.id)}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsModal;