import React from 'react'
import { useState } from 'react';
import sumaryApi from '../../common';

const HeaderAdminDashboard = () => {
    const [searchUserId, setSearchUserId] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchUserId.trim()) {
            console.log('Searching for user:', searchUserId);
        }
    };

    const handleLogout = async() => {
        // Xử lý đăng xuất
        const response = await fetch(sumaryApi.logout.url, {
            method: sumaryApi.logout.method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                 
            }
        });
        const data = await response.json();
        if (data.success) {
            console.log('Logout successful');
            // Xóa token, clear storage, redirect về trang login
            localStorage.removeItem('accessToken');
            window.location.href = '/';
        }
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
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
                        <div className="admin-dropdown">
                            <button 
                                className="logout-btn"
                                onClick={confirmLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal xác nhận đăng xuất */}
            {showLogoutConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-modal">
                        <div className="modal-header">
                            <h3>Xác nhận đăng xuất</h3>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn đăng xuất?</p>
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={cancelLogout} 
                                className="cancel-btn"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="confirm-btn"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default HeaderAdminDashboard