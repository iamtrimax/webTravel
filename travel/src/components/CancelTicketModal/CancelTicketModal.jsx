import React from 'react'

const CancelTicketModal = ({ cancelConfirm, setCancelConfirm, loading, handleCancelTicket }) => {
    return (
        <div className="modal-overlay">
            <div className="cancel-modal">
                <div className="modal-header">
                    <h3>Xác nhận hủy vé</h3>
                    <button
                        className="close-btn"
                        onClick={() => setCancelConfirm(null)}
                        disabled={loading}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-content">
                    <p>Bạn có chắc chắn muốn hủy vé <strong>#{cancelConfirm.idBooking}</strong>?</p>
                    <p className="tour-name">{cancelConfirm.tour?.title || 'Tour du lịch'}</p>
                    <div className="cancellation-policy">
                        <h4>Chính sách hủy vé:</h4>
                        <p>Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn</p>
                    </div>
                    {cancelConfirm.bookingStatus === 'pending' && (
                        <div className="pending-cancellation-info">
                            <p><strong>Lưu ý:</strong> Vé đang chờ xác nhận, việc hủy vé sẽ được xử lý ngay lập tức.</p>
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button
                        className="btn-cancel"
                        onClick={() => setCancelConfirm(null)}
                        disabled={loading}
                    >
                        Quay lại
                    </button>
                    <button
                        className="btn-confirm"
                        onClick={() => handleCancelTicket(cancelConfirm._id)}
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
)
}

export default CancelTicketModal