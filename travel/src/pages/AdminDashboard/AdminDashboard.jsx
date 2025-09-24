import React, { useState, useEffect } from 'react';
import './AdminDashboard.scss';
import SideBar from '../../componets/SideBar/SideBar';
import HeaderAdminDashboard from '../../componets/HeaderAdminDashboard/HeaderAdminDashboard';
import EmailManagement from '../../componets/EmailManagement/EmailManagement';
import DashboardOverview from '../../componets/DashboardOverview/DashboardOverview';
import UserManagement from '../../componets/UserManagement/UserManagement';
import TourManagement from '../../componets/TourManagement/TourManagement';
import BookingManagement from '../../componets/BookingManagement/BookingManagement';
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [stats, setStats] = useState({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    dailyBookings: 0,
    monthlyBookings: 0,
    totalUsers: 0,
    activeTours: 0,
    unreadEmails: 0
  });

  // Mock data cho emails
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [emailFilter, setEmailFilter] = useState('all'); // all, unread, replied

  useEffect(() => {
    // Giả lập dữ liệu thống kê
    setStats({
      dailyRevenue: 12500000,
      monthlyRevenue: 375000000,
      dailyBookings: 47,
      monthlyBookings: 1250,
      totalUsers: 5842,
      activeTours: 36,
      unreadEmails: 3
    });

    // Giả lập dữ liệu emails
    setEmails([
      {
        id: 1,
        userId: 'USR001',
        userName: 'Nguyễn Văn A',
        userEmail: 'nguyenvana@email.com',
        subject: 'Hỏi về tour Đà Nẵng',
        content: 'Tôi muốn hỏi về lịch trình tour Đà Nẵng 4 ngày 3 đêm...',
        timestamp: '2024-01-15 14:30',
        isRead: false,
        isReplied: false,
        priority: 'high'
      },
      {
        id: 2,
        userId: 'USR002',
        userName: 'Trần Thị B',
        userEmail: 'tranthib@email.com',
        subject: 'Đặt tour Phú Quốc',
        content: 'Tôi muốn đặt tour Phú Quốc cho 2 người vào cuối tháng...',
        timestamp: '2024-01-15 10:15',
        isRead: true,
        isReplied: true,
        priority: 'medium'
      },
      {
        id: 3,
        userId: 'USR003',
        userName: 'Lê Văn C',
        userEmail: 'levanc@email.com',
        subject: 'Hủy tour Hạ Long',
        content: 'Tôi muốn hủy tour Hạ Long đã đặt do lý do cá nhân...',
        timestamp: '2024-01-14 16:45',
        isRead: false,
        isReplied: false,
        priority: 'high'
      },
      {
        id: 4,
        userId: 'USR004',
        userName: 'Phạm Thị D',
        userEmail: 'phamthid@email.com',
        subject: 'Feedback tour Sapa',
        content: 'Tour Sapa vừa rồi rất tuyệt vời, cảm ơn công ty...',
        timestamp: '2024-01-14 09:20',
        isRead: true,
        isReplied: false,
        priority: 'low'
      }
    ]);
  }, []);




  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setReplyContent('');
    
    // Đánh dấu email đã đọc
    if (!email.isRead) {
      setEmails(emails.map(e => 
        e.id === email.id ? {...e, isRead: true} : e
      ));
      
      // Cập nhật số email chưa đọc
      setStats(prev => ({
        ...prev,
        unreadEmails: Math.max(0, prev.unreadEmails - 1)
      }));
    }
  };

  const handleSendReply = () => {
    if (!selectedEmail || !replyContent.trim()) return;

    // Cập nhật trạng thái email đã phản hồi
    setEmails(emails.map(e => 
      e.id === selectedEmail.id ? {...e, isReplied: true} : e
    ));

    // Giả lập gửi email
    console.log('Gửi phản hồi đến:', selectedEmail.userEmail);
    console.log('Nội dung:', replyContent);

    // Reset form
    setReplyContent('');
    alert('Phản hồi đã được gửi thành công!');
  };

  const filteredEmails = emails.filter(email => {
    if (emailFilter === 'unread') return !email.isRead;
    if (emailFilter === 'replied') return email.isReplied;
    return true;
  });

  const renderContent = () => {
    switch (activeMenu) {
      case 'users':
        return <UserManagement />;
      case 'tours':
        return <TourManagement />;
      case 'tickets':
        return <BookingManagement />;
      case 'emails':
        return <EmailManagement 
          emails={filteredEmails}
          selectedEmail={selectedEmail}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onEmailClick={handleEmailClick}
          onSendReply={handleSendReply}
          emailFilter={emailFilter}
          setEmailFilter={setEmailFilter}
        />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Toggle */}
      {/** <SideBar/> */}
      <SideBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} unreadEmails={stats.unreadEmails} />
      {/* Main Content */}
      <div className="admin-main">

        {/* Header */}
        <HeaderAdminDashboard />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;