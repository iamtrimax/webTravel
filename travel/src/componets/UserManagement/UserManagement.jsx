import { useEffect } from "react";
import { useState } from "react";
import UserCard from "../UserCard/UserCard";
import AddUserModal from "../AddUserModal/AddUserModal";
import sumaryApi from "../../common";
import { toast } from "react-toastify";

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
      // API call để lấy danh sách user - Thay bằng API thực tế
      const response = await fetch(sumaryApi.getAllUsers.url, {
        method: sumaryApi.getAllUsers.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
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
      const response = await fetch(sumaryApi.createUser.url, {
        method: sumaryApi.createUser.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      const addedUser = data;

      if (addedUser.error) {
        toast.error(addedUser.message);
      }
      if (addedUser.success) {

        toast.success(addedUser.message);

        setUsers([...users, addedUser.data]);

        setShowAddUserModal(false);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
      }

    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xoá user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xoá người dùng này?')) return;

    try {
      // API call để xoá user 
      const response = await fetch(sumaryApi.deleteUser.url.replace(':id', userId), {
        method: sumaryApi.deleteUser.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      console.log(data);
      
      if (data.error) {
        toast.error(data.message);
        return;
      }
      // Cập nhật lại danh sách user sau khi xoá
      if (data.success) {
        setUsers(users.filter(user => user._id !== userId));
        toast.success(data.message);
        // Tải lại danh sách người dùng từ server
        fetchUsers()
      }
    } catch (error) {
      console.error('Lỗi khi xoá người dùng:', error);
    }
  };

  // Xử lý cập nhật role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(sumaryApi.updateRoleUser.url.replace(':id', userId), {
        method: sumaryApi.updateRoleUser.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật quyền:', error);
      alert('Lỗi khi cập nhật quyền!');
    }
  };

  // Xử lý khoá/mở khoá tài khoản
  const handleToggleLock = async (userId) => {

    try {
      const response = await fetch(sumaryApi.toggleBlockUser.url.replace(':id', userId), {
        method: sumaryApi.toggleBlockUser.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  // Lọc users theo search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(user => {
      return (
        (user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    : [];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ff4444';
      case 'moderator': return '#ffaa00';
      case 'user': return '#00C851';
      default: return '#888';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive === true ? '#00C851' : '#ff4444';
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
              key={user._id}
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
export default UserManagement;