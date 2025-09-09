import React, { useState, useEffect, useRef } from "react";
import "./Banner.scss";
import logobanner from "../../assets/002.jpg";
import banner2 from "../../assets/002.jpg";
import banner3 from "../../assets/20170825165703-travel.jpg";
import banner4 from "../../assets/travel_plane_corona.webp";
const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);
  
  const images = [logobanner, banner2, banner3, banner4];
  const titles = [
    "Khám phá thế giới cùng chúng tôi",
    "Trải nghiệm những chuyến đi đáng nhớ",
    "Khơi dậy đam mê du lịch của bạn",
    "Hành trình tuyệt vời bắt đầu từ đây"
  ];
  const descriptions = [
    "Đặt tour du lịch trực tuyến dễ dàng và tận hưởng hành trình trọn vẹn.",
    "Khám phá những điểm đến tuyệt vời với dịch vụ chuyên nghiệp.",
    "Trải nghiệm văn hóa độc đáo và cảnh quan thiên nhiên hùng vĩ.",
    "Biến giấc mơ du lịch của bạn thành hiện thực với chúng tôi."
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 5000);
    
    // Intersection Observer để kích hoạt hiệu ứng khi scroll vào view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }
    
    return () => {
      clearInterval(interval);
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [images.length]);

  const handleMouseMove = (e) => {
    if (bannerRef.current) {
      const rect = bannerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const goToSlide = (index) => {
    setCurrentImage(index);
  };

  return (
    <section 
      className="banner" 
      ref={bannerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="banner-background">
        {images.map((img, index) => (
          <div
            key={index}
            className={`background-slide ${index === currentImage ? "active" : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        
        <div 
          className="parallax-overlay"
          style={{ 
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        ></div>
      </div>
      
      <div className="banner-content">
        <div className="content-inner">
          <h1 
            className={`title ${isVisible ? 'visible' : ''}`}
            style={{ 
              transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
            }}
          >
            {titles[currentImage]}
          </h1>
          
          <p 
            className={`description ${isVisible ? 'visible' : ''}`}
            style={{ 
              transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
            }}
          >
            {descriptions[currentImage]}
          </p>
          
          <div className={`btn-container ${isVisible ? 'visible' : ''}`}>
            <a href="#tours" className="btn primary">
              <span>Khám phá ngay</span>
              <div className="btn-hover-effect"></div>
            </a>
            <a href="#about" className="btn secondary">
              <span>Tìm hiểu thêm</span>
              <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="banner-features">
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-globe-americas"></i>
          </div>
          <span>100+ Điểm đến</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <span>Hướng dẫn viên chuyên nghiệp</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-thumbs-up"></i>
          </div>
          <span>Đặt tour dễ dàng</span>
        </div>
      </div>
      
      <div className="slide-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImage ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Chuyển đến slide ${index + 1}`}
          >
            <div className="indicator-progress"></div>
          </button>
        ))}
      </div>
      
      <div className="scroll-indicator">
        <span>Cuộn xuống</span>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
      
      <div className="particles-container">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Banner;