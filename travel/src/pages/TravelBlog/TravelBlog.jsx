import React, { useState, useEffect, useRef } from 'react';
import './TravelBlog.scss';
import uploadImage from '../../helper/uploadImage';
import { toast } from 'react-toastify';
import sumaryApi from '../../common';
import { jwtDecode } from 'jwt-decode';

const TravelBlog = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('accessToken');

  const fetchPosts = async () => {
    try {
      const response = await fetch(sumaryApi.getAllPosts.url, {
        method: sumaryApi.getAllPosts.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success) {
        const formattedPosts = data.data.map(post => ({
          ...post,
          // Format the post data as needed
        }));
        setExperiences(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);

    return () => clearInterval(interval);
  }, [token]);

  // Modal functions
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const results = await Promise.all(files.map((file) => uploadImage(file)));
      const images = results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));
      setImages((prev) => [...prev, ...images]);
    } catch (err) {
      console.error("Upload thất bại:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const removeImage = async (index, e) => {
    console.log("remove imagesssssssssssssss");
    e.stopPropagation();
    e.preventDefault();
    const image = images[index];
    try {
      await fetch(sumaryApi.deleteImage.url, {
        method: sumaryApi.deleteImage.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ public_id: image.public_id }),
      });

      setImages(images.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Xoá ảnh thất bại:", err);
    }
  };

  const handleCreateExperience = async (e) => {
    e.preventDefault();
    const newExperience = {
      title,
      content,
      images

    };
    const fetchPost = await fetch(sumaryApi.postShare.url, {
      method: sumaryApi.postShare.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newExperience)
    });
    const data = await fetchPost.json();
    if (data.success) {
      toast.success('Đăng bài thành công!');
      setExperiences([newExperience, ...experiences]);
      setTitle('');
      setContent('');
      setImages([]);
      setIsModalOpen(false);
    }
    else {
      toast.error(data.message || 'Đăng bài thất bại!');
    }
  };

  // Experience functions
  const handleLike = async (id) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    const fetchRes = await fetch(sumaryApi.likePost.url.replace(':id', id), {
      method: sumaryApi.likePost.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await fetchRes.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    setExperiences(experiences.map(exp =>
      exp._id === id ? {
        ...exp,
        liked: !exp.liked,
        likes: exp.liked ? exp.likes.filter(likeId => likeId !== 'currentUserId') : [...exp.likes, 'currentUserId']
      } : exp
    ));

  };
  const toggleComments = (expId) => {
    setExpandedComments(prev => ({
      ...prev,
      [expId]: !prev[expId]
    }));
  };
  const handleDeleteExperience = async (id) => {
    const experience = experiences.find(exp => exp._id === id);
    if (experience.images && experience.images.length > 0) {
      for (const img of experience.images) {
        await fetch(sumaryApi.deleteImage.url, {
          method: sumaryApi.deleteImage.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ public_id: img.public_id }),
        });
      }
    }
    const fetchRes = await fetch(sumaryApi.deletePost.url.replace(':id', id), {
      method: sumaryApi.deletePost.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await fetchRes.json();
    if (data.success) {
      setExperiences(experiences.filter(exp => exp._id !== id));
    } else {
      console.error(data.message || 'Xóa bài viết thất bại!');
    }
  };
const addComment = async (expId, commentText) => {
  if (!commentText.trim()) return;

  // 1. Tạo comment tạm thời
  const tempComment = {
    _id: `temp-${Date.now()}`,
    user: {
      _id: jwtDecode(token).id,
      username: jwtDecode(token).username || 'Bạn'
    },
    content: commentText,
    createdAt: new Date().toISOString()
  };

  // 2. Optimistic update - thêm comment ngay lập tức
  setExperiences(prevExperiences => 
    prevExperiences.map(exp => 
      exp._id === expId 
        ? { ...exp, comments: [...exp.comments, tempComment] }
        : exp
    )
  );

  try {
    // 3. Gọi API
    const fetchRes = await fetch(sumaryApi.postComment.url.replace(':id', expId), {
      method: sumaryApi.postComment.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: commentText })
    });

    const data = await fetchRes.json();

    if (data.success) {
      // 4. Thay thế comment tạm bằng comment thật từ server
      const newComment = data.data.comments[data.data.comments.length - 1];
      
      setExperiences(prevExperiences => 
        prevExperiences.map(exp => 
          exp._id === expId 
            ? {
                ...exp,
                comments: exp.comments.map(comment => 
                  comment._id === tempComment._id ? newComment : comment
                )
              }
            : exp
        )
      );
      
    } else {
      // 5. Rollback nếu API fail
      setExperiences(prevExperiences => 
        prevExperiences.map(exp => 
          exp._id === expId 
            ? { ...exp, comments: exp.comments.filter(c => c._id !== tempComment._id) }
            : exp
        )
      );
      toast.error(data.message || 'Thêm bình luận thất bại!');
    }
  } catch (error) {
    // 6. Rollback nếu có lỗi network
    setExperiences(prevExperiences => 
      prevExperiences.map(exp => 
        exp._id === expId 
          ? { ...exp, comments: exp.comments.filter(c => c._id !== tempComment._id) }
          : exp
      )
    );
    console.error("Error adding comment:", error);
    toast.error("Lỗi kết nối khi thêm bình luận!");
  }
};
  const handleDeleteComment = async (experienceId, commentId) => {
    try {
      const fetchRes = await fetch(
        sumaryApi.deleteComment.url
          .replace(':id', experienceId)
          .replace(':commentId', commentId),
        {
          method: sumaryApi.deleteComment.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await fetchRes.json();

      if (data.success) {
        // Cập nhật state trực tiếp - KHÔNG cần fetch lại
        setExperiences(experiences.map(exp => {
          if (exp._id === experienceId) {
            const updatedComments = exp.comments.filter(comment =>
              comment._id !== commentId
            );

            return {
              ...exp,
              comments: updatedComments,
              // Giảm số lượng comments count nếu có
              ...(exp.commentsCount && {
                commentsCount: exp.commentsCount - 1
              })
            };
          }
          return exp;
        }));

      } else {
        toast.error(data.message || 'Xóa bình luận thất bại!');
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error('Lỗi khi xóa bình luận!');
    }
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
            onClick={() => { token ? setIsModalOpen(true) : toast.error('Vui lòng đăng nhập để đăng bài'); }}
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
            <div key={experience._id} className="experience-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="user-info">
                  <span className="user-avatar">{experience.author?.username.charAt(0)}</span>
                  <div className="user-details">
                    <h3 className="user-name">{experience.author?.username}</h3>
                    <span className="post-date">{new Date(experience.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {
                  token && experience.author?._id === jwtDecode(token).id &&
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteExperience(experience._id)}
                    title="Xóa bài viết"
                  >
                    🗑️
                  </button>
                }
              </div>

              {/* Card Content */}
              <div className="card-content">
                <h2 className="experience-title">{experience.title}</h2>
                <p className="experience-content">{experience.content}</p>

                {/* Image Gallery */}
                {experience.images && experience?.images.length > 0 && (
                  <div className="image-gallery">
                    {experience.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image.url} alt={`Experience ${index + 1}`} />
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
                    onClick={() => handleLike(experience._id)}
                  >
                    <span className="like-icon">❤️</span>
                    <span className="like-count">{experience?.likes?.length}</span>
                  </button>
                  <button className="comment-btn">
                    <span className="comment-icon">💬</span>
                    <span className="comment-count">{experience?.comments?.length}</span>
                  </button>
                </div>
              </div>
              <div className="comments-section">
                {/* Hiển thị bình luận với toggle */}
                <div className="comments-list">
                  {/* Kiểm tra comments tồn tại và là mảng */}
                  {Array.isArray(experience.comments) && experience.comments
                    .slice(0, expandedComments[experience._id] ? experience.comments.length : 5)
                    .map(comment => (
                      <div key={comment._id || comment.id} className="comment-item">
                        <div className="comment-avatar">
                          {comment.user?.username?.charAt(0) || '👤'}
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-user">
                              {comment.user?.username || 'Người dùng'}
                            </span>
                            <span className="comment-time">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                            </span>
                            {/* Nút xoá comment - chỉ hiển thị cho chủ sở hữu hoặc admin */}
                            {token && (comment.user?._id === jwtDecode(token)?.id || jwtDecode(token)?.role === 'admin') && (
                              <button
                                className="delete-comment-btn"
                                onClick={() => handleDeleteComment(experience._id, comment._id)}
                                title="Xóa bình luận"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  }

                  {/* Toggle button để xem thêm/ẩn bớt bình luận */}
                  {Array.isArray(experience.comments) && experience.comments.length > 5 && (
                    <button
                      className="toggle-comments-btn"
                      onClick={() => toggleComments(experience._id)}
                    >
                      {expandedComments[experience._id]
                        ? 'Ẩn bớt'
                        : `Xem thêm ${experience.comments.length - 5} bình luận`
                      }
                    </button>
                  )}

                  {/* Hiển thị khi không có comments */}
                  {(!experience.comments || experience.comments.length === 0) && (
                    <div className="no-comments">
                      Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </div>
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
                        addComment(experience._id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="post-comment-btn"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      addComment(experience._id, input.value);
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
                    onChange={(e) => handleFileSelect(e)}
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
                          onClick={(e) => removeImage(index, e)}
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
    </div>
  );
};

export default TravelBlog;