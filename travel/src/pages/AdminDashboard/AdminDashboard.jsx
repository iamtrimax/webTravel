import React, { useState, useEffect } from 'react';
import './AdminDashboard.scss';
import SideBar from '../../components/SideBar/SideBar';
import HeaderAdminDashboard from '../../components/HeaderAdminDashboard/HeaderAdminDashboard';
import EmailManagement from '../../components/EmailManagement/EmailManagement';
import DashboardOverview from '../../components/DashboardOverview/DashboardOverview';
import UserManagement from '../../components/UserManagement/UserManagement';
import TourManagement from '../../components/TourManagement/TourManagement';
import BookingManagement from '../../components/BookingManagement/BookingManagement';
import socket, { connectSocket } from "../../Socket/Socket";
import sumaryApi from '../../common';
import { toast } from 'react-toastify';
import AdminPostManagement from '../../components/AdminPostManagement/AdminPostManagement';
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
  
  const [monthlyData, setMonthlyData] = useState([]) 
    const [dailyBookingData, setDailyBookingData] = useState([]) 

  const fetchDailyRevenue = async () => {
    const fetchRevenue = await fetch(sumaryApi.getDailyRevenue.url, {
      method: sumaryApi.getDailyRevenue.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchRevenue.json();
    setStats(prev => ({ ...prev, dailyRevenue: res.data.totalRevenue }));
  }
  const fetchDailyBooking = async () => {
    const fetchBookingCount = await fetch(sumaryApi.getDailyBooking.url, {
      method: sumaryApi.getDailyBooking.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchBookingCount.json();
    setStats(prev => ({ ...prev, dailyBookings: res.data.totalBookings }));
  }
  const fetchTotalUser = async () => {
    const fetchBookingCount = await fetch(sumaryApi.getTotalUser.url, {
      method: sumaryApi.getTotalUser.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchBookingCount.json();
    setStats(prev => ({ ...prev, totalUsers: res.data }));
  }
   const fetchUnreadEmail = async () => {
    const fetchEmailCount = await fetch(sumaryApi.getUnreadEmail.url, {
      method: sumaryApi.getUnreadEmail.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchEmailCount.json();
    setStats(prev => ({ ...prev, unreadEmails: res.data.unreadCount}));
  }
    const fetchMonthlyRevenue = async () => {
    const fetchRevenue = await fetch(sumaryApi.getMonthlyRevenue.url, {
      method: sumaryApi.getMonthlyRevenue.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchRevenue.json();
    setMonthlyData(res.data);
  }
    const fetchDailyBookings = async () => {
    const fetchBookingData = await fetch(sumaryApi.getDailyBookings.url, {
      method: sumaryApi.getDailyBookings.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
    const res = await fetchBookingData.json();
    setDailyBookingData(res.data);
  }
  useEffect(() => {

    fetchDailyRevenue()
    fetchDailyBooking()
    fetchTotalUser()
    fetchUnreadEmail()
    fetchMonthlyRevenue()
    fetchEmail();
    fetchDailyBookings()

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
        e._id === email._id ? { ...e, isRead: true } : e
      ));

      // Cập nhật số email chưa đọc
      setStats(prev => ({
        ...prev,
        unreadEmails: Math.max(0, prev.unreadEmails - 1)
      }));
    }
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyContent.trim()) return;
    const sendMail = await fetch(sumaryApi.replyEmail.url, {
      method: sumaryApi.replyEmail.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({
        userEmail: selectedEmail?.userId?.email,
        subject: selectedEmail.subject,
        content: replyContent
      })
    })
    const data = await sendMail.json()

    if (data.success) {

      toast.success(data.message)

      // Cập nhật trạng thái email đã phản hồi
      setEmails(emails.map(e =>
        e._id === selectedEmail._id ? { ...e, isReplied: true } : e
      ));

      // Giả lập gửi email
      console.log('Gửi phản hồi đến:', selectedEmail?.userId?.email);
      console.log('Nội dung:', replyContent);

      // Reset form
      setReplyContent('');
    }
    if (data.error) {
      toast.error(data.message)
    }
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
      case 'posts':
        return <AdminPostManagement />;
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
        return <DashboardOverview stats={stats} monthlyData={monthlyData} dailyBookingsData={dailyBookingData} />;
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