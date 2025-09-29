import React, { useState, useEffect } from 'react';
import './AdminDashboard.scss';
import SideBar from '../../componets/SideBar/SideBar';
import HeaderAdminDashboard from '../../componets/HeaderAdminDashboard/HeaderAdminDashboard';
import EmailManagement from '../../componets/EmailManagement/EmailManagement';
import DashboardOverview from '../../componets/DashboardOverview/DashboardOverview';
import UserManagement from '../../componets/UserManagement/UserManagement';
import TourManagement from '../../componets/TourManagement/TourManagement';
import BookingManagement from '../../componets/BookingManagement/BookingManagement';
import socket, { connectSocket } from "../../Socket/Socket";
import sumaryApi from '../../common';
import { jwtDecode } from "jwt-decode";
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
    fetchEmail();
    connectSocket()
    socket.on("connect", () => {
      console.log("user connect......", socket.id);
      
    })
    socket.on("sent", (newEmail) => {
      console.log("mail đến..........")
      setEmails(prev => [newEmail, ...prev]);
      setStats(prev => ({ ...prev, unreadEmails: prev.unreadEmails + 1 }));
    });

    return () => { socket.off("sent") };

  }, []);



  const fetchEmail = async () => {
    const response = await fetch(sumaryApi.getAllEmail.url, {
      method: sumaryApi.getAllEmail.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      setEmails(data.data);
    }
  }
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setReplyContent('');

    // Đánh dấu email đã đọc
    if (!email.isRead) {
      setEmails(emails.map(e =>
        e.id === email.id ? { ...e, isRead: true } : e
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
      e.id === selectedEmail.id ? { ...e, isReplied: true } : e
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