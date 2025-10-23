import React from 'react'
import { toast } from 'react-toastify'

const SidebarMytickets = ({ activeTab, setActiveTab, bookingStats }) => {
    return (
        <div className="sidebar">
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <i className="fas fa-clock"></i>
                    <span>Chờ xác nhận</span>
                    <span className="nav-badge">{bookingStats.pending}</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <i className="fas fa-plane-departure"></i>
                    <span>Tour sắp tới</span>
                    <span className="nav-badge">{bookingStats.confirmed}</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    <i className="fas fa-check-circle"></i>
                    <span>Tour đã hoàn thành</span>
                    <span className="nav-badge">{bookingStats.completed}</span>
                </button>
                <button
                    className={`nav-item ${activeTab === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cancelled')}
                >
                    <i className="fas fa-times-circle"></i>
                    <span>Tour đã hủy</span>
                    <span className="nav-badge">{bookingStats.cancelled}</span>
                </button>
            </nav>

            <div className="sidebar-help">
                <h4>📞 Cần hỗ trợ?</h4>
                <p>Liên hệ với chúng tôi để được giải đáp thắc mắc</p>
                <button className="support-btn" onClick={() => toast.info('Tính năng đang phát triển')}>
                    <i className="fas fa-headset"></i>
                    Liên hệ hỗ trợ
                </button>
            </div>
        </div>
    )
}

export default SidebarMytickets