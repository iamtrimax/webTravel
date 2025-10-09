import React, { useState, useEffect, useRef } from 'react';
import './TravelBlog.scss';

const TravelBlog = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);

  // Sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        avatar: '👤',
        title: 'Trải nghiệm tuyệt vời tại Đà Lạt',
        content: 'Tour Đà Lạt 3 ngày 2 đêm thật sự rất đáng giá. Cảnh đẹp, hướng dẫn viên nhiệt tình, dịch vụ chuyên nghiệp. Tôi sẽ quay lại!',
        images: [
          " https://res.cloudinary.com/djijqsmz8/image/upload/v1759331480/w4xykxacef9qw9hfosxl.webp",
          "https://res.cloudinary.com/djijqsmz8/image/upload/v1759331480/w4xykxacef9qw9hfosxl.webp",
          "https://res.cloudinary.com/djijqsmz8/image/upload/v1759331480/w4xykxacef9qw9hfosxl.webp",
          "https://res.cloudinary.com/djijqsmz8/image/upload/v1759331480/w4xykxacef9qw9hfosxl.webp"
        ],
        likes: 24,
        comments: 5,
        date: '2024-01-15',
        liked: false,
        commentList: []
      },
      {
        id: 2,
        user: 'Trần Thị B',
        avatar: '👩',
        title: 'Hạ Long - Kỳ quan thiên nhiên',
        content: 'Vịnh Hạ Long đẹp không thể tả bằng lời. Du thuyền sang trọng, ẩm thực đặc sắc. Highly recommended!',
        images: [
          'https://via.placeholder.com/400x300/F5A623/FFFFFF?text=Hạ+Long+1',
          'https://via.placeholder.com/400x300/BD10E0/FFFFFF?text=Hạ+Long+2'
        ],
        likes: 42,
        comments: 8,
        date: '2024-01-12',
        liked: true,
        commentList: []
      }
    ];
    setExperiences(sampleData);
  }, []);

  // Modal functions
  const handleFileSelect = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateExperience = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    const newExperience = {
      id: Date.now(),
      user: 'Khách hàng',
      avatar: '👤',
      title,
      content,
      images: images.map(img => img.url),
      likes: 0,
      comments: 0,
      date: new Date().toISOString().split('T')[0],
      liked: false,
      commentList: []
    };

    setExperiences([newExperience, ...experiences]);
    setTitle('');
    setContent('');
    setImages([]);
    setIsModalOpen(false);
  };

  // Experience functions
  const handleLike = (id) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? {
        ...exp,
        likes: exp.liked ? exp.likes - 1 : exp.likes + 1,
        liked: !exp.liked
      } : exp
    ));
  };
  const toggleComments = (expId) => {
    setExpandedComments(prev => ({
      ...prev,
      [expId]: !prev[expId]
    }));
  };
  const handleDeleteImage = (expId, imageIndex) => {
    setExperiences(experiences.map(exp =>
      exp.id === expId ? {
        ...exp,
        images: exp.images.filter((_, index) => index !== imageIndex)
      } : exp
    ));
  };

  const handleEditImage = (expId, imageIndex, editedImage) => {
    setExperiences(experiences.map(exp =>
      exp.id === expId ? {
        ...exp,
        images: exp.images.map((img, index) =>
          index === imageIndex ? editedImage : img
        )
      } : exp
    ));
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const addComment = (expId, commentText) => {
    if (!commentText.trim()) return;

    setExperiences(experiences.map(exp =>
      exp.id === expId ? {
        ...exp,
        comments: exp.comments + 1,
        commentList: [...exp.commentList, {
          id: Date.now(),
          user: 'Người dùng',
          avatar: '👤',
          text: commentText,
          date: new Date().toLocaleTimeString()
        }]
      } : exp
    ));
  };

  // Image Editor Component
  const ImageEditor = ({ image, onClose, onSave }) => {
    const [editedImage, setEditedImage] = useState(image);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const applyFilters = () => {
      return {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      };
    };

    const handleSave = () => {
      onSave(editedImage);
    };

    return (
      <div className="image-editor-overlay" onClick={onClose}>
        <div className="image-editor-modal" onClick={e => e.stopPropagation()}>
          <div className="editor-header">
            <h3>Chỉnh Sửa Ảnh</h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="editor-content">
            <div className="image-preview">
              <img
                src={image}
                alt="Editing"
                style={applyFilters()}
              />
            </div>

            <div className="editor-controls">
              <div className="control-group">
                <label>Độ sáng: {brightness}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                />
              </div>

              <div className="control-group">
                <label>Độ tương phản: {contrast}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(e.target.value)}
                />
              </div>

              <div className="control-group">
                <label>Độ bão hòa: {saturation}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button className="cancel-btn" onClick={onClose}>Hủy</button>
            <button className="save-btn" onClick={handleSave}>Lưu Thay Đổi</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="experience-page">
      {/* Header */}
      <div className="experience-header">
        <div className="container">
          <h1 className="page-title">Chia Sẻ Trải Nghiệm</h1>
          <p className="page-subtitle">
            Cùng chia sẻ những khoảnh khắc đáng nhớ trong chuyến du lịch của bạn
          </p>
          <button
            className="create-post-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="btn-icon">✍️</span>
            <span className="btn-text">Đăng Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Experiences Grid */}
      <div className="container">
        <div className="experiences-grid">
          {experiences.map((experience) => (
            <div key={experience.id} className="experience-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="user-info">
                  <span className="user-avatar">{experience.avatar}</span>
                  <div className="user-details">
                    <h3 className="user-name">{experience.user}</h3>
                    <span className="post-date">{experience.date}</span>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteExperience(experience.id)}
                  title="Xóa bài viết"
                >
                  🗑️
                </button>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <h2 className="experience-title">{experience.title}</h2>
                <p className="experience-content">{experience.content}</p>

                {/* Image Gallery */}
                {experience.images && experience.images.length > 0 && (
                  <div className="image-gallery">
                    {experience.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Experience ${index + 1}`} />
                        <div className="image-actions">
                          <button
                            className="edit-image-btn"
                            onClick={() => {
                              setSelectedImage(image);
                              setIsEditing(true);
                            }}
                            title="Chỉnh sửa ảnh"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-image-btn"
                            onClick={() => handleDeleteImage(experience.id, index)}
                            title="Xóa ảnh"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <div className="engagement-stats">
                  <button
                    className={`like-btn ${experience.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(experience.id)}
                  >
                    <span className="like-icon">❤️</span>
                    <span className="like-count">{experience.likes}</span>
                  </button>
                  <button className="comment-btn">
                    <span className="comment-icon">💬</span>
                    <span className="comment-count">{experience.comments}</span>
                  </button>
                </div>

                <button className="share-btn">
                  <span className="share-icon">📤</span>
                  Chia sẻ
                </button>
              </div>

              // Trong component Experience Card, sửa phần Comments Section:
              <div className="comments-section">
                {/* Hiển thị bình luận với toggle */}
                <div className="comments-list">
                  {experience.commentList && experience.commentList
                    .slice(0, expandedComments[experience.id] ? experience.commentList.length : 5)
                    .map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-avatar">{comment.avatar}</div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-user">{comment.user}</span>
                            <span className="comment-time">{comment.date}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  }

                  {/* Toggle button để xem thêm/ẩn bớt bình luận */}
                  {experience.commentList && experience.commentList.length > 5 && (
                    <button
                      className="toggle-comments-btn"
                      onClick={() => toggleComments(experience.id)}
                    >
                      {expandedComments[experience.id] ? 'Ẩn bớt' : `Xem thêm ${experience.commentList.length - 5} bình luận`}
                    </button>
                  )}
                </div>

                {/* Comment Input */}
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Thêm bình luận..."
                    className="comment-field"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(experience.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="post-comment-btn"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addComment(experience.id, input.value);
                      input.value = '';
                    }}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Experience Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="experience-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chia Sẻ Trải Nghiệm</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateExperience} className="modal-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="title-input"
                  maxLength={100}
                />
                <span className="char-count">{title.length}/100</span>
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="content-textarea"
                  rows="6"
                  maxLength={1000}
                />
                <span className="char-count">{content.length}/1000</span>
              </div>

              {/* Image Upload Area */}
              <div className="form-group">
                <div
                  className={`upload-area ${isDragging ? 'dragging' : ''} ${images.length > 0 ? 'has-images' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-content">
                    <span className="upload-icon">📷</span>
                    <p>Kéo thả ảnh vào đây hoặc click để chọn</p>
                    <small>Hỗ trợ JPG, PNG (Tối đa 10MB)</small>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="image-previews">
                    {images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img src={image.url} alt={`Preview ${index + 1}`} />
                        <button
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  Đăng Bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {isEditing && selectedImage && (
        <ImageEditor
          image={selectedImage}
          onClose={() => {
            setIsEditing(false);
            setSelectedImage(null);
          }}
          onSave={(editedImage) => {
            // In a real app, you would update the image URL
            // For demo, we'll just use the same image
            setIsEditing(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

export default TravelBlog;