import React from 'react'


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
    <>
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
                  className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${!email.isRead ? 'unread' : ''
                    }`}
                  onClick={() => onEmailClick(email)}
                >
                  <div className="email-header-info">
                    <span className="email-priority">
                      {getPriorityIcon(email.priority)}
                    </span>
                    <span className="email-sender">{email?.userId?.username||"Người dùng không tồn tại"}</span>
                    <span className="email-time">{new Date(email.createdAt).toLocaleDateString().split('T')[0]}</span>
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
                    <p><strong>Người gửi:</strong> {selectedEmail?.userId?.username||"người dùng không tồn tại"} ({selectedEmail?.userId?.email})</p>
                    <p><strong>Thời gian:</strong> {new Date(selectedEmail.createdAt).toLocaleDateString().split('T')[0]}</p>
                    <p><strong>User ID:</strong> {selectedEmail?.userId?._id}</p>
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

    </>
  )
}

export default EmailManagement