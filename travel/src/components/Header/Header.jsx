import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = ({ onAuthClick, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('/');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const allNavItems = [
    { label: 'Đặt Tour', path: '/booking' },
    { label: 'VÉ CỦA TÔI', path: '/my-ticket', requiresAuth: true },
    { label: 'Trải Nghiệm', path: '/travel-blog' },
    { label: 'Liên hệ', path: '/contact-page' }
  ];

  const navItems = allNavItems.filter(item =>
    !item.requiresAuth || (item.requiresAuth && user)
  );

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/') {
      setActiveTab('/');
      return;
    } else {
      const activeItem = navItems.find(item => item.path === currentPath);
      if (activeItem) {
        setActiveTab(activeItem.label);
      }
    }
  }, [location, navItems]);

  return (
    <header className="cinene-header">
      <div className="header-top">
        <div className="container">
          <div className="logo-container">
            <Link to="/" className="logo">
              <span className="logo-c">T</span>
              <span className="logo-i">R</span>
              <span className="logo-n">A</span>
              <span className="logo-e">V</span>
              <span className="logo-n2">E</span>
              <span className="logo-e2">L</span>
            </Link>
          </div>

          <div className="auth-buttons">
            {user ? (
              <div className="user-info">
                {/* Notification Container với Tailwind CSS */}
                <span className="user-name">👤 {user.username}</span>
                <button className="logout-btn" onClick={onLogout}>
                  ĐĂNG XUẤT
                </button>
              </div>
            ) : (
              <>
                <button className="auth-btn login-btn" onClick={() => onAuthClick('login')}>
                  <span className="btn-icon">👤</span>
                  <span className="btn-text">ĐĂNG NHẬP</span>
                </button>
                <button className="auth-btn register-btn" onClick={() => onAuthClick('register')}>
                  <span className="btn-icon">✍️</span>
                  <span className="btn-text">ĐĂNG KÝ</span>
                </button>
              </>
            )}
          </div>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <div className={`header-bottom ${isMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <nav className="main-nav">
            <ul>
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={activeTab === item.label ? 'active' : ''}
                  onClick={() => setActiveTab(item.label)}
                >
                  <Link to={item.path}>
                    {item.label}
                    <span className="nav-underline"></span>
                    <span className="nav-hover-effect"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="header-decoration">
        <div className="film-strip"></div>
        <div className="spotlight"></div>
      </div>
    </header>
  );
};

export default Header;