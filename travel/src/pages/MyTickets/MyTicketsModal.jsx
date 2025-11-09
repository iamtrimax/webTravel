// MyTicketsModal.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyTicketsModal.scss';
import sumaryApi from '../../common';
import { toast } from 'react-toastify';
import socket from '../../Socket/Socket';
import formatPrice from '../../helper/formatPrice';
import TicketStats from '../../components/TicketStats/TicketStats';
import SidebarMytickets from '../../components/SidebarMyTickets/SidebarMytickets';
import TicketList from '../../components/TicketList/TicketList';
import CancelTicketModal from '../../components/CancelTicketModal/CancelTicketModal';

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
    //  const response = await fetch("http://localhost:3000/api/checkapi", {
    //     method: "post",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
  };

  // Format functions


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
      <TicketStats bookingStats={bookingStats} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <section className="tickets-content">
        <div className="container">
          <div className="content-wrapper">
            {/* Sidebar */}
            <SidebarMytickets 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              bookingStats={bookingStats}
            />

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
              <TicketList
                currentTickets={currentTickets}
                activeTab={activeTab}
                setSelectedTicket={setSelectedTicket}
                setCancelConfirm={setCancelConfirm}
                handlePrintTicket={handlePrintTicket}
                getStatusBadge={getStatusBadge}
                selectedTicket={selectedTicket}
                handleShareTicket={handleShareTicket}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <CancelTicketModal
          cancelConfirm={cancelConfirm}
          setCancelConfirm={setCancelConfirm}
          loading={loading}
          handleCancelTicket={handleCancelTicket}
        />
      )}
    </div>
  );
};

export default MyTicketsModal;