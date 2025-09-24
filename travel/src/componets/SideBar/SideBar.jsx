import React from 'react'
import { useState } from 'react';

const SideBar = ({activeMenu, setActiveMenu, unreadEmails}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    



    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setIsMobileMenuOpen(false);
    };



    return (
        <>
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
                        {unreadEmails > 0 && (
                            <span className="email-badge">{unreadEmails}</span>
                        )}
                    </button>
                </nav>
            </div>
        </>
    )
}

export default SideBar