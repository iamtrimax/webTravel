import { useState } from "react";

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
            style={{ backgroundColor: getStatusColor(user.isActive) }}
          >
            {user.isActive === true ? 'Hoạt động' : 'Đã khoá'}
          </span>
        </div>
        <div className="detail-item">
          <span className="label">Ngày tạo:</span>
          <span>{new Date(user.createdAt).toISOString().split('T')[0]}</span>
        </div>
      </div>

      {showActions && (
        <div className="user-actions-menu">
          <button 
            className="action-btn update-role"
            onClick={() => {
              const newRole = prompt('Nhập role mới (admin/moderator/user):', user.role);
              if (newRole && ['admin', 'moderator', 'user'].includes(newRole)) {
                onUpdateRole(user._id, newRole);
              }
            }}
          >
            🔄 Cập nhật Role
          </button>
          <button 
            className="action-btn toggle-lock"
            onClick={() => onToggleLock(user._id)}
          >
            {user.isActive === true ? '🔒 Khoá tài khoản' : '🔓 Mở khoá tài khoản'}
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(user._id)}
          >
            🗑️ Xoá người dùng
          </button>
        </div>
      )}
    </div>
  );
};
export default UserCard;