import React, { useState, useEffect } from 'react';
import './AdminDashboard.scss';
import logo2 from "../../assets/logo2.png";
import logo from "../../assets/logo.png";
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchUserId, setSearchUserId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUserId.trim()) {
      console.log('Searching for user:', searchUserId);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
  };

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
        return <TicketManagement />;
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
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? '' : 'mobile-hidden'}`}>
        <div className="sidebar-header">
          <h2>Tour Admin</h2>
          <div className="admin-avatar">A</div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleMenuClick('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}
            onClick={() => handleMenuClick('users')}
          >
            👥 Quản lý người dùng
          </button>
          <button 
            className={`nav-item ${activeMenu === 'tours' ? 'active' : ''}`}
            onClick={() => handleMenuClick('tours')}
          >
            🏝️ Quản lý Tour
          </button>
          <button 
            className={`nav-item ${activeMenu === 'tickets' ? 'active' : ''}`}
            onClick={() => handleMenuClick('tickets')}
          >
            🎫 Quản lý Vé
          </button>
          <button 
            className={`nav-item ${activeMenu === 'emails' ? 'active' : ''}`}
            onClick={() => handleMenuClick('emails')}
          >
            📧 Quản lý Email
            {stats.unreadEmails > 0 && (
              <span className="email-badge">{stats.unreadEmails}</span>
            )}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Quản trị hệ thống</h1>
          </div>
          <div className="header-right">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Tìm kiếm ID người dùng..."
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>
            <div className="admin-info">
              <span>Xin chào, Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Component Quản lý Email
const EmailManagement = ({ 
  emails, 
  selectedEmail, 
  replyContent, 
  setReplyContent, 
  onEmailClick, 
  onSendReply,
  emailFilter,
  setEmailFilter 
}) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="email-management">
      <div className="email-header">
        <h2>📧 Quản lý Email</h2>
        <div className="email-filters">
          <button 
            className={`filter-btn ${emailFilter === 'all' ? 'active' : ''}`}
            onClick={() => setEmailFilter('all')}
          >
            Tất cả ({emails.length})
          </button>
          <button 
            className={`filter-btn ${emailFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setEmailFilter('unread')}
          >
            Chưa đọc ({emails.filter(e => !e.isRead).length})
          </button>
          <button 
            className={`filter-btn ${emailFilter === 'replied' ? 'active' : ''}`}
            onClick={() => setEmailFilter('replied')}
          >
            Đã phản hồi ({emails.filter(e => e.isReplied).length})
          </button>
        </div>
      </div>

      <div className="email-layout">
        {/* Danh sách email */}
        <div className="email-list">
          {emails.length === 0 ? (
            <div className="no-emails">Không có email nào</div>
          ) : (
            emails.map(email => (
              <div 
                key={email.id}
                className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${
                  !email.isRead ? 'unread' : ''
                }`}
                onClick={() => onEmailClick(email)}
              >
                <div className="email-header-info">
                  <span className="email-priority">
                    {getPriorityIcon(email.priority)}
                  </span>
                  <span className="email-sender">{email.userName}</span>
                  <span className="email-time">{email.timestamp}</span>
                </div>
                <div className="email-subject">{email.subject}</div>
                <div className="email-preview">{email.content.substring(0, 100)}...</div>
                <div className="email-status">
                  {!email.isRead && <span className="status-unread">Mới</span>}
                  {email.isReplied && <span className="status-replied">Đã phản hồi</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chi tiết email và phản hồi */}
        <div className="email-detail">
          {selectedEmail ? (
            <>
              <div className="email-detail-header">
                <h3>{selectedEmail.subject}</h3>
                <div className="email-meta">
                  <p><strong>Người gửi:</strong> {selectedEmail.userName} ({selectedEmail.userEmail})</p>
                  <p><strong>Thời gian:</strong> {selectedEmail.timestamp}</p>
                  <p><strong>User ID:</strong> {selectedEmail.userId}</p>
                </div>
              </div>

              <div className="email-content">
                <p>{selectedEmail.content}</p>
              </div>

              <div className="email-reply">
                <h4>Phản hồi</h4>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Nhập nội dung phản hồi..."
                  rows="6"
                  className="reply-textarea"
                />
                <div className="reply-actions">
                  <button 
                    onClick={onSendReply}
                    disabled={!replyContent.trim()}
                    className="send-reply-btn"
                  >
                    📤 Gửi phản hồi
                  </button>
                  {selectedEmail.isReplied && (
                    <span className="already-replied">✓ Đã phản hồi</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-email-selected">
              <p>Chọn một email để xem chi tiết và phản hồi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Các component khác giữ nguyên...
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
//quản lý người dùng
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State cho form thêm user
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Mock data - Thay thế bằng API call thực tế
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Giả lập API call - Thay bằng API thực tế
      const mockUsers = [
        {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@email.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: '2024-01-15 14:30'
        },
        {
          id: 2,
          username: 'tranthib',
          email: 'tranthib@email.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-14 10:15'
        },
        {
          id: 3,
          username: 'levanc',
          email: 'levanc@email.com',
          role: 'user',
          status: 'locked',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-13 16:45'
        },
        {
          id: 4,
          username: 'phamthid',
          email: 'phamthid@email.com',
          role: 'moderator',
          status: 'active',
          createdAt: '2024-01-12',
          lastLogin: '2024-01-15 09:20'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm user mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call để thêm user - Thay bằng API thực tế
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      };

      // Giả lập API response
      const addedUser = {
        id: users.length + 1,
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null
      };

      setUsers([...users, addedUser]);
      setShowAddUserModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      
      alert('Thêm người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      alert('Lỗi khi thêm người dùng!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xoá user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xoá người dùng này?')) return;

    try {
      // API call để xoá user - Thay bằng API thực tế
      setUsers(users.filter(user => user.id !== userId));
      alert('Xoá người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xoá người dùng:', error);
      alert('Lỗi khi xoá người dùng!');
    }
  };

  // Xử lý cập nhật role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // API call để cập nhật role - Thay bằng API thực tế
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      alert('Cập nhật quyền thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error);
      alert('Lỗi khi cập nhật quyền!');
    }
  };

  // Xử lý khoá/mở khoá tài khoản
  const handleToggleLock = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'locked' : 'active';
    
    try {
      // API call để khoá/mở khoá - Thay bằng API thực tế
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      alert(`${newStatus === 'locked' ? 'Khoá' : 'Mở khoá'} tài khoản thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  // Lọc users theo search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ff4444';
      case 'moderator': return '#ffaa00';
      case 'user': return '#00C851';
      default: return '#888';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#00C851' : '#ff4444';
  };

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>👥 Quản lý Người dùng</h2>
        <div className="user-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo username hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button 
            className="add-user-btn"
            onClick={() => setShowAddUserModal(true)}
          >
            ➕ Thêm người dùng
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="users-grid">
          {filteredUsers.map(user => (
            <UserCard 
              key={user.id}
              user={user}
              onDelete={handleDeleteUser}
              onUpdateRole={handleUpdateRole}
              onToggleLock={handleToggleLock}
              getRoleColor={getRoleColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {/* Modal thêm user */}
      {showAddUserModal && (
        <AddUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          onSubmit={handleAddUser}
          onClose={() => setShowAddUserModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

// Component User Card
const UserCard = ({ user, onDelete, onUpdateRole, onToggleLock, getRoleColor, getStatusColor }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <h3 className="username">{user.username}</h3>
          <p className="user-email">{user.email}</p>
        </div>
        <button 
          className="action-toggle"
          onClick={() => setShowActions(!showActions)}
        >
          ⋮
        </button>
      </div>

      <div className="user-details">
        <div className="detail-item">
          <span className="label">Role:</span>
          <span 
            className="role-badge"
            style={{ backgroundColor: getRoleColor(user.role) }}
          >
            {user.role}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Trạng thái:</span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(user.status) }}
          >
            {user.status === 'active' ? 'Hoạt động' : 'Đã khoá'}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Ngày tạo:</span>
          <span>{user.createdAt}</span>
        </div>
        <div className="detail-item">
          <span className="label">Đăng nhập cuối:</span>
          <span>{user.lastLogin || 'Chưa đăng nhập'}</span>
        </div>
      </div>

      {showActions && (
        <div className="user-actions-menu">
          <button 
            className="action-btn update-role"
            onClick={() => {
              const newRole = prompt('Nhập role mới (admin/moderator/user):', user.role);
              if (newRole && ['admin', 'moderator', 'user'].includes(newRole)) {
                onUpdateRole(user.id, newRole);
              }
            }}
          >
            🔄 Cập nhật Role
          </button>
          <button 
            className="action-btn toggle-lock"
            onClick={() => onToggleLock(user.id, user.status)}
          >
            {user.status === 'active' ? '🔒 Khoá tài khoản' : '🔓 Mở khoá tài khoản'}
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(user.id)}
          >
            🗑️ Xoá người dùng
          </button>
        </div>
      )}
    </div>
  );
};

// Component Modal thêm user
const AddUserModal = ({ newUser, setNewUser, onSubmit, onClose, loading }) => {
  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Thêm người dùng mới</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={onSubmit} className="add-user-form">
          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              required
              placeholder="Nhập username"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              required
              placeholder="Nhập password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={newUser.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Đang xử lý...' : 'Thêm người dùng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Component Quản lý Tour
const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // State cho form thêm/sửa tour
  const [tourForm, setTourForm] = useState({
    title: '',
    description: '',
    destination: '',
    pickupPoint: '',
    duration: 1,
    price: 0,
    discount: 0,
    images: [],
    itinerary: '',
    includes: '',
    excludes: '',
    startDate: '',
    endDate: '',
    totalSlots: 0,
    bookedSlots: 0,
    tags: [],
    category: 'adventure',
    status: 'active'
  });

  // Mock data - Thay thế bằng API call thực tế
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      // Giả lập API call - Thay bằng API thực tế
      const mockTours = [
        {
          id: 1,
          title: 'Tour Đà Nẵng - Hội An 4 Ngày 3 Đêm',
          description: 'Khám phá thành phố đáng sống nhất Việt Nam',
          destination: 'Đà Nẵng, Hội An',
          pickupPoint: 'Sân bay Đà Nẵng',
          duration: 4,
          price: 3500000,
          discount: 10,
          images: ['logo', 'da-nang-2.jpg'],
          itinerary: 'Ngày 1: Đón sân bay - Bà Nà Hills...',
          includes: 'Khách sạn 3*, ăn sáng, vé tham quan',
          excludes: 'Ăn trưa, ăn tối, chi phí cá nhân',
          startDate: '2024-02-01',
          endDate: '2024-12-31',
          totalSlots: 50,
          bookedSlots: 25,
          tags: ['biển', 'văn hóa', 'ẩm thực'],
          category: 'cultural',
          status: 'active',
          createdAt: '2024-01-01',
          rating: 4.8
        },
        {
          id: 2,
          title: 'Tour Sapa Trekking 3 Ngày 2 Đêm',
          description: 'Trải nghiệm trekking qua các bản làng dân tộc',
          destination: 'Sapa, Lào Cai',
          pickupPoint: 'Ga Lào Cai',
          duration: 3,
          price: 2500000,
          discount: 15,
          images: ['sapa-1.jpg', 'sapa-2.jpg'],
          itinerary: 'Ngày 1: Hà Nội - Sapa - Cat Cat...',
          includes: 'Homestay, hướng dẫn viên, bảo hiểm',
          excludes: 'Xe cá nhân, đồ uống có cồn',
          startDate: '2024-02-15',
          endDate: '2024-11-30',
          totalSlots: 30,
          bookedSlots: 28,
          tags: ['trekking', 'núi rừng', 'dân tộc'],
          category: 'adventure',
          status: 'active',
          createdAt: '2024-01-05',
          rating: 4.9
        },
        {
          id: 3,
          title: 'Tour Phú Quốc 5 Ngày 4 Đêm',
          description: 'Thiên đường biển đảo miền Nam',
          destination: 'Phú Quốc, Kiên Giang',
          pickupPoint: 'Sân bay Phú Quốc',
          duration: 5,
          price: 5000000,
          discount: 5,
          images: ['phu-quoc-1.jpg', 'phu-quoc-2.jpg'],
          itinerary: 'Ngày 1: Đảo ngọc - Bãi Sao...',
          includes: 'Resort 4*, ăn sáng, tour đảo',
          excludes: 'Massage, spa, golf',
          startDate: '2024-03-01',
          endDate: '2024-10-31',
          totalSlots: 40,
          bookedSlots: 15,
          tags: ['biển', 'nghỉ dưỡng', 'ẩm thực'],
          category: 'beach',
          status: 'inactive',
          createdAt: '2024-01-10',
          rating: 4.7
        }
      ];
      setTours(mockTours);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tour:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm tour mới
  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call để thêm tour - Thay bằng API thực tế
      const tourData = {
        ...tourForm,
        id: tours.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        bookedSlots: 0,
        rating: 0
      };

      setTours([...tours, tourData]);
      setShowAddTourModal(false);
      resetTourForm();
      
      alert('Thêm tour thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm tour:', error);
      alert('Lỗi khi thêm tour!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật tour
  const handleUpdateTour = async (e) => {
    e.preventDefault();
    if (!selectedTour) return;
    
    setLoading(true);
    try {
      // API call để cập nhật tour - Thay bằng API thực tế
      setTours(tours.map(tour => 
        tour.id === selectedTour.id ? { ...tour, ...tourForm } : tour
      ));
      setShowEditTourModal(false);
      setSelectedTour(null);
      resetTourForm();
      
      alert('Cập nhật tour thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật tour:', error);
      alert('Lỗi khi cập nhật tour!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xoá tour
  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Bạn có chắc muốn xoá tour này?')) return;

    try {
      // API call để xoá tour - Thay bằng API thực tế
      setTours(tours.filter(tour => tour.id !== tourId));
      alert('Xoá tour thành công!');
    } catch (error) {
      console.error('Lỗi khi xoá tour:', error);
      alert('Lỗi khi xoá tour!');
    }
  };

  // Xử lý cập nhật trạng thái tour
  const handleToggleStatus = async (tourId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      // API call để cập nhật trạng thái - Thay bằng API thực tế
      setTours(tours.map(tour => 
        tour.id === tourId ? { ...tour, status: newStatus } : tour
      ));
      alert(`${newStatus === 'active' ? 'Kích hoạt' : 'Ẩn'} tour thành công!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  // Mở modal chỉnh sửa tour
  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setTourForm({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      pickupPoint: tour.pickupPoint,
      duration: tour.duration,
      price: tour.price,
      discount: tour.discount,
      images: tour.images,
      itinerary: tour.itinerary,
      includes: tour.includes,
      excludes: tour.excludes,
      startDate: tour.startDate,
      endDate: tour.endDate,
      totalSlots: tour.totalSlots,
      bookedSlots: tour.bookedSlots,
      tags: tour.tags,
      category: tour.category,
      status: tour.status
    });
    setShowEditTourModal(true);
  };

  // Reset form tour
  const resetTourForm = () => {
    setTourForm({
      title: '',
      description: '',
      destination: '',
      pickupPoint: '',
      duration: 1,
      price: 0,
      discount: 0,
      images: [],
      itinerary: '',
      includes: '',
      excludes: '',
      startDate: '',
      endDate: '',
      totalSlots: 0,
      bookedSlots: 0,
      tags: [],
      category: 'adventure',
      status: 'active'
    });
  };

  // Xử lý thêm tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      setTourForm({
        ...tourForm,
        tags: [...tourForm.tags, newTag]
      });
      e.target.value = '';
    }
  };

  // Xử lý xoá tag
  const handleRemoveTag = (tagToRemove) => {
    setTourForm({
      ...tourForm,
      tags: tourForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Lọc tours
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'adventure': return '#ff4444';
      case 'beach': return '#00d4ff';
      case 'cultural': return '#00C851';
      case 'mountain': return '#ffaa00';
      case 'city': return '#aa66cc';
      default: return '#888';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#00C851' : '#ff4444';
  };

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  return (
    <div className="tour-management">
      <div className="tour-header">
        <h2>🏝️ Quản lý Tour</h2>
        <div className="tour-actions">
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="adventure">Adventure</option>
              <option value="beach">Beach</option>
              <option value="cultural">Cultural</option>
              <option value="mountain">Mountain</option>
              <option value="city">City</option>
            </select>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã ẩn</option>
            </select>
          </div>
          
          <button 
            className="add-tour-btn"
            onClick={() => setShowAddTourModal(true)}
          >
            🆕 Thêm Tour Mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="tours-grid">
          {filteredTours.map(tour => (
            <TourCard 
              key={tour.id}
              tour={tour}
              onEdit={handleEditTour}
              onDelete={handleDeleteTour}
              onToggleStatus={handleToggleStatus}
              getCategoryColor={getCategoryColor}
              getStatusColor={getStatusColor}
              calculateFinalPrice={calculateFinalPrice}
            />
          ))}
        </div>
      )}

      {/* Modal thêm tour */}
      {showAddTourModal && (
        <TourModal
          mode="add"
          tourForm={tourForm}
          setTourForm={setTourForm}
          onSubmit={handleAddTour}
          onClose={() => setShowAddTourModal(false)}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          loading={loading}
        />
      )}

      {/* Modal chỉnh sửa tour */}
      {showEditTourModal && (
        <TourModal
          mode="edit"
          tourForm={tourForm}
          setTourForm={setTourForm}
          onSubmit={handleUpdateTour}
          onClose={() => {
            setShowEditTourModal(false);
            setSelectedTour(null);
            resetTourForm();
          }}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          loading={loading}
        />
      )}
    </div>
  );
};

// Component Tour Card
const TourCard = ({ tour, onEdit, onDelete, onToggleStatus, getCategoryColor, getStatusColor, calculateFinalPrice }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="tour-card">
      <div className="tour-card-header">
        <div className="tour-image">
          <img src={logo2} alt={tour.title} />
          <div className="tour-badges">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(tour.category) }}
            >
              {tour.category}
            </span>
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(tour.status) }}
            >
              {tour.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="tour-info">
          <h3 className="tour-title">{tour.title}</h3>
          <p className="tour-destination">📍 {tour.destination}</p>
          <p className="tour-description">{tour.description}</p>
          
          <div className="tour-details">
            <div className="detail-item">
              <span>⏱️ {tour.duration} ngày</span>
              <span>👥 {tour.bookedSlots}/{tour.totalSlots} vé</span>
            </div>
            <div className="detail-item">
              <span className="original-price">{tour.price.toLocaleString()} VND</span>
              {tour.discount > 0 && (
                <span className="discount-price">
                  {calculateFinalPrice(tour.price, tour.discount).toLocaleString()} VND
                  <span className="discount-percent">(-{tour.discount}%)</span>
                </span>
              )}
            </div>
            <div className="detail-item">
              <span>⭐ {tour.rating}/5</span>
              <span>📅 {tour.startDate} to {tour.endDate}</span>
            </div>
          </div>
        </div>
        
        <button 
          className="action-toggle"
          onClick={() => setShowActions(!showActions)}
        >
          ⋮
        </button>
      </div>

      {showActions && (
        <div className="tour-actions-menu">
          <button 
            className="action-btn edit"
            onClick={() => onEdit(tour)}
          >
            ✏️ Chỉnh sửa
          </button>
          <button 
            className="action-btn status"
            onClick={() => onToggleStatus(tour.id, tour.status)}
          >
            {tour.status === 'active' ? '👁️ Ẩn tour' : '👁️ Hiện tour'}
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(tour.id)}
          >
            🗑️ Xoá tour
          </button>
        </div>
      )}
    </div>
  );
};

// Component Modal Tour (dùng cho cả thêm và sửa)
const TourModal = ({ mode, tourForm, setTourForm, onSubmit, onClose, onAddTag, onRemoveTag, loading }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setTourForm({
      ...tourForm,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setTourForm({
      ...tourForm,
      [name]: value.split(',').map(item => item.trim())
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>{mode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh sửa Tour'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={onSubmit} className="tour-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tiêu đề tour *</label>
              <input
                type="text"
                name="title"
                value={tourForm.title}
                onChange={handleChange}
                required
                placeholder="Nhập tiêu đề tour"
              />
            </div>
            
            <div className="form-group">
              <label>Điểm đến *</label>
              <input
                type="text"
                name="destination"
                value={tourForm.destination}
                onChange={handleChange}
                required
                placeholder="Nhập điểm đến"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả *</label>
            <textarea
              name="description"
              value={tourForm.description}
              onChange={handleChange}
              required
              placeholder="Nhập mô tả tour"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Điểm đón *</label>
              <input
                type="text"
                name="pickupPoint"
                value={tourForm.pickupPoint}
                onChange={handleChange}
                required
                placeholder="Nhập điểm đón"
              />
            </div>
            
            <div className="form-group">
              <label>Số ngày *</label>
              <input
                type="number"
                name="duration"
                value={tourForm.duration}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Giá gốc (VND) *</label>
              <input
                type="number"
                name="price"
                value={tourForm.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Giảm giá (%)</label>
              <input
                type="number"
                name="discount"
                value={tourForm.discount}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày bắt đầu *</label>
              <input
                type="date"
                name="startDate"
                value={tourForm.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Ngày kết thúc *</label>
              <input
                type="date"
                name="endDate"
                value={tourForm.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tổng số vé *</label>
              <input
                type="number"
                name="totalSlots"
                value={tourForm.totalSlots}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Danh mục *</label>
              <select name="category" value={tourForm.category} onChange={handleChange}>
                <option value="adventure">Adventure</option>
                <option value="beach">Beach</option>
                <option value="cultural">Cultural</option>
                <option value="mountain">Mountain</option>
                <option value="city">City</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tags (nhấn Enter để thêm)</label>
            <input
              type="text"
              placeholder="Nhập tag và nhấn Enter"
              onKeyPress={onAddTag}
              className="tag-input"
            />
            <div className="tags-container">
              {tourForm.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => onRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Lịch trình *</label>
            <textarea
              name="itinerary"
              value={tourForm.itinerary}
              onChange={handleChange}
              required
              placeholder="Nhập lịch trình chi tiết"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bao gồm *</label>
              <textarea
                name="includes"
                value={tourForm.includes}
                onChange={handleChange}
                required
                placeholder="Dịch vụ bao gồm"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Không bao gồm *</label>
              <textarea
                name="excludes"
                value={tourForm.excludes}
                onChange={handleChange}
                required
                placeholder="Dịch vụ không bao gồm"
                rows="3"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Hình ảnh (URL, phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              name="images"
              value={tourForm.images.join(', ')}
              onChange={handleArrayChange}
              placeholder="image1.jpg, image2.jpg"
            />
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={tourForm.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Đang xử lý...' : (mode === 'add' ? 'Thêm Tour' : 'Cập nhật Tour')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const TicketManagement = () => {
  return <div className="management-section"><h2>Quản lý Vé</h2></div>;
};

export default AdminDashboard;