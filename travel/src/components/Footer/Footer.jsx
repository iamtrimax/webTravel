import React from 'react';
import './Footer.scss';
const Footer = () => {
  return (
    <footer className="cinene-footer">
      <div className="footer-decoration">
        <div className="film-strip"></div>
        <div className="spotlight"></div>
      </div>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-section logo-section">
            <div className="footer-logo">
              <span className="logo-c">T</span>
              <span className="logo-i">R</span>
              <span className="logo-n">A</span>
              <span className="logo-e">V</span>
              <span className="logo-n2">E</span>
              <span className="logo-e2">L</span>
            </div>
            <p className="footer-description">
              Khám phá thế giới với những trải nghiệm du lịch đáng nhớ. 
              Chúng tôi mang đến cho bạn những tour du lịch chất lượng 
              với dịch vụ chuyên nghiệp.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-section links-section">
            <h3 className="section-title">Liên Kết Nhanh</h3>
            <ul className="footer-links">
              <li><a href="/booking">Đặt Tour</a></li>
              <li><a href="/my-ticket">Vé Của Tôi</a></li>
              <li><a href="/travel-blog">Trải Nghiệm</a></li>
              <li><a href="/about">Về Chúng Tôi</a></li>
              <li><a href="/contact-page">Liên Hệ</a></li>
            </ul>
          </div>

          <div className="footer-section services-section">
            <h3 className="section-title">Dịch Vụ</h3>
            <ul className="footer-links">
              <li><a href="/tours-domestic">Tour Trong Nước</a></li>
              <li><a href="/tours-international">Tour Quốc Tế</a></li>
              <li><a href="/hotels">Khách Sạn</a></li>
              <li><a href="/transport">Vận Chuyển</a></li>
              <li><a href="/insurance">Bảo Hiểm Du Lịch</a></li>
            </ul>
          </div>

          <div className="footer-section contact-section">
            <h3 className="section-title">Liên Hệ</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@travel.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <span>8:00 - 22:00 (Thứ 2 - Chủ Nhật)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Đăng Ký Nhận Tin</h3>
            <p className="newsletter-description">
              Nhận thông tin khuyến mãi và tour mới nhất qua email
            </p>
            <form className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  <span>Đăng Ký</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2024 TRAVEL. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;