import React from 'react'
import formatPrice from '../../helper/formatPrice';
import { Link } from 'react-router-dom';

const TicketList = ({ currentTickets, activeTab, setSelectedTicket, setCancelConfirm, handlePrintTicket, getStatusBadge, selectedTicket, handleShareTicket, formatDate }) => {
    return (
        <div className="tickets-list">
            {currentTickets.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h3>Không tìm thấy vé nào</h3>
                    <p>
                        {activeTab === 'pending' ? 'Không có vé nào đang chờ xác nhận' :
                            activeTab === 'upcoming' ? 'Bạn chưa có tour nào sắp tới' :
                                activeTab === 'completed' ? 'Bạn chưa hoàn thành tour nào' :
                                    'Bạn chưa hủy tour nào'}
                    </p>
                    <Link to="/tours" className="explore-btn">
                        <i className="fas fa-compass"></i>
                        Khám phá tour ngay
                    </Link>
                </div>
            ) : (
                currentTickets.map((ticket) => (
                    <div key={ticket._id} className="ticket-item">
                        <div className="ticket-image">
                            <img
                                src={ticket.tour?.images?.[0].url || '/default-tour.jpg'}
                                alt={ticket.tour?.title}
                                onError={(e) => {
                                    e.target.src = '/default-tour.jpg';
                                }}
                            />
                            <div className="image-overlay">
                                <span className="tour-duration">{ticket.tour?.duration || '1 ngày'}</span>
                                <span className="tour-price">{formatPrice(ticket.totalPrice)}</span>
                            </div>
                        </div>

                        <div className="ticket-info">
                            <div className="ticket-header">
                                <div className="ticket-meta">
                                    <span className="ticket-id">#{ticket.idBooking}</span>
                                    {getStatusBadge(ticket.bookingStatus)}
                                    {ticket.bookingStatus === 'cancelled' && ticket.cancelReason && (

                                        <span className="text-red-600">Hệ thống tự huỷ do: {ticket.cancelReason}</span>

                                    )}
                                </div>
                                <div className="ticket-actions">
                                    <button
                                        className="action-btn detail"
                                        onClick={() => setSelectedTicket(selectedTicket?._id === ticket._id ? null : ticket)}
                                    >
                                        <i className="fas fa-info-circle"></i>
                                        {selectedTicket?._id === ticket._id ? 'Thu gọn' : 'Chi tiết'}
                                    </button>

                                    {(ticket.bookingStatus === 'pending' || ticket.bookingStatus === 'confirmed') && (
                                        <button
                                            className="action-btn cancel"
                                            onClick={() => setCancelConfirm(ticket)}
                                        >
                                            <i className="fas fa-times"></i>
                                            Hủy vé
                                        </button>
                                    )}

                                    {ticket.bookingStatus === 'confirmed' && (
                                        <button
                                            className="action-btn print"
                                            onClick={() => handlePrintTicket(ticket)}
                                        >
                                            <i className="fas fa-print"></i>
                                            In vé
                                        </button>
                                    )}

                                    <button
                                        className="action-btn share"
                                        onClick={() => handleShareTicket(ticket)}
                                    >
                                        <i className="fas fa-share-alt"></i>
                                        Chia sẻ
                                    </button>
                                </div>
                            </div>

                            <h3 className="tour-name">{ticket.tour?.title || 'Tour du lịch'}</h3>

                            <div className="tour-details">
                                <div className="detail-group">
                                    <span className="detail-label">
                                        <i className="fas fa-calendar-alt"></i>
                                        Ngày đi:
                                    </span>
                                    <span className="detail-value">{formatDate(ticket.bookingDate)}</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">
                                        <i className="fas fa-clock"></i>
                                        Giờ khởi hành:
                                    </span>
                                    <span className="detail-value">7:30</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">
                                        <i className="fas fa-users"></i>
                                        Số lượng:
                                    </span>
                                    <span className="detail-value">{ticket.bookingSlots} người</span>
                                </div>
                                <div className="detail-group">
                                    <span className="detail-label">
                                        <i className="fas fa-wallet"></i>
                                        Tổng tiền:
                                    </span>
                                    <span className="detail-value price">{formatPrice(ticket.totalPrice)}</span>
                                </div>

                                {ticket.bookingStatus === 'pending' && (
                                    <div className="detail-group">
                                        <span className="detail-label">
                                            <i className="fas fa-hourglass-half"></i>
                                            Ngày đặt:
                                        </span>
                                        <span className="detail-value confirmation-time">
                                            {formatDate(ticket.createdAt)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Expanded Details */}
                            {selectedTicket?._id === ticket._id && (
                                <div className="ticket-expanded">
                                    <div className="expanded-content">
                                        <div className="detail-section">
                                            <h4>📋 Thông tin chi tiết</h4>
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <label>Mã đặt tour:</label>
                                                    <span>{ticket.idBooking}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Ngày đặt:</label>
                                                    <span>{formatDate(ticket.createdAt)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Khách hàng:</label>
                                                    <span>{ticket.fullname}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Email:</label>
                                                    <span>{ticket.email}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Số điện thoại:</label>
                                                    <span>{ticket.phone}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Điểm tập trung:</label>
                                                    <span>{ticket.tour?.meetingPoint || 'Đang cập nhật'}</span>
                                                </div>
                                                <div className="detail-item full-width">
                                                    <label>Chính sách hủy:</label>
                                                    <span className="policy">
                                                        Hủy trước 7 ngày: hoàn 100% | Trước 3 ngày: hoàn 50% | Dưới 3 ngày: không hoàn
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {ticket.tour?.inclusions && ticket.tour.inclusions.length > 0 && (
                                            <div className="includes-section">
                                                <h4>✅ Dịch vụ bao gồm</h4>
                                                <div className="includes-list">
                                                    {ticket.tour.inclusions.map((item, index) => (
                                                        <span key={index} className="include-item">
                                                            <i className="fas fa-check"></i>
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {ticket.specialRequire && (
                                            <div className="notes-section">
                                                <h4>📝 Yêu cầu đặc biệt</h4>
                                                <p>{ticket.specialRequire}</p>
                                            </div>
                                        )}

                                        {ticket.bookingStatus === 'cancelled' && ticket.payStatus === 'refunded' && (
                                            <div className="refund-section">
                                                <h4>💳 Thông tin hoàn tiền</h4>
                                                <div className="refund-info">
                                                    <p><strong>Trạng thái:</strong> Đã hoàn tiền</p>
                                                    <p><strong>Số tiền hoàn:</strong> {formatPrice(ticket.totalPrice)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default TicketList