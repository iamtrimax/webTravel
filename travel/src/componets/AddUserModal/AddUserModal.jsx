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
              minLength="8"
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
export default AddUserModal;