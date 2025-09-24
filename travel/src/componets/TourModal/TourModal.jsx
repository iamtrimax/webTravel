import { useRef } from "react";

const TourModal = ({ mode, tourForm, setTourForm, onSubmit, onClose, onAddTag, onRemoveTag, loading }) => {
    const fileInputRef = useRef(null);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setTourForm({
            ...tourForm,
            [name]: type === 'number' ? parseInt(value) : value
        });
    };

    // Xử lý khi chọn file ảnh
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));

            setTourForm({
                ...tourForm,
                images: [...tourForm.images, ...newImages]
            });
        }
    };

    // Xóa ảnh đã chọn
    const handleRemoveImage = (index) => {
        const newImages = tourForm.images.filter((_, i) => i !== index);
        setTourForm({
            ...tourForm,
            images: newImages
        });
        if (newImages.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input file nếu không còn ảnh
        }
    };

    // Xử lý thay đổi lịch trình
    const handleItineraryChange = (index, field, value) => {
        const updatedItinerary = tourForm.itinerary.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        setTourForm({
            ...tourForm,
            itinerary: updatedItinerary
        });
    };

    // Thêm ngày mới vào lịch trình
    const addItineraryDay = () => {
        const newDay = {
            day: tourForm.itinerary.length + 1,
            title: '',
            description: ''
        };

        setTourForm({
            ...tourForm,
            itinerary: [...tourForm.itinerary, newDay]
        });
    };

    // Xóa ngày khỏi lịch trình
    const removeItineraryDay = (index) => {
        const updatedItinerary = tourForm.itinerary.filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, day: i + 1 }));

        setTourForm({
            ...tourForm,
            itinerary: updatedItinerary
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large-modal">
                <div className="modal-header">
                    <h3>{mode === 'add' ? 'Thêm Tour Mới' : 'Chỉnh sửa Tour'}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={onSubmit} className="tour-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tiêu đề tour *</label>
                            <input
                                type="text"
                                name="title"
                                value={tourForm.title}
                                onChange={handleChange}
                                required
                                placeholder="Nhập tiêu đề tour"
                            />
                        </div>

                        <div className="form-group">
                            <label>Điểm đến *</label>
                            <input
                                type="text"
                                name="destination"
                                value={tourForm.destination}
                                onChange={handleChange}
                                required
                                placeholder="Nhập điểm đến"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả *</label>
                        <textarea
                            name="description"
                            value={tourForm.description}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mô tả tour"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Điểm đón *</label>
                            <input
                                type="text"
                                name="pickupPoint"
                                value={tourForm.pickupPoint}
                                onChange={handleChange}
                                required
                                placeholder="Nhập điểm đón"
                            />
                        </div>

                        <div className="form-group">
                            <label>Số ngày *</label>
                            <input
                                type="number"
                                name="duration"
                                value={tourForm.duration}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Giá gốc (VND) *</label>
                            <input
                                type="number"
                                name="price"
                                value={tourForm.price}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Giảm giá (%)</label>
                            <input
                                type="number"
                                name="discount"
                                value={tourForm.discount}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Ngày bắt đầu *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={tourForm.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngày kết thúc *</label>
                            <input
                                type="date"
                                name="endDate"
                                value={tourForm.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tổng số vé *</label>
                            <input
                                type="number"
                                name="totalSlots"
                                value={tourForm.totalSlots}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Danh mục *</label>
                            <select name="category" value={tourForm.category} onChange={handleChange}>
                                <option value="adventure">Adventure</option>
                                <option value="beach">Beach</option>
                                <option value="cultural">Cultural</option>
                                <option value="mountain">Mountain</option>
                                <option value="city">City</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tags (nhấn Enter để thêm)</label>
                        <input
                            type="text"
                            placeholder="Nhập tag và nhấn Enter"
                            onKeyPress={onAddTag}
                            className="tag-input"
                        />
                        <div className="tags-container">
                            {tourForm.tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                    <button type="button" onClick={() => onRemoveTag(tag)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Phần lịch trình mới */}
                    <div className="form-group">
                        <div className="itinerary-header">
                            <label>Lịch trình *</label>
                            <button type="button" onClick={addItineraryDay} className="add-day-btn">
                                + Thêm ngày
                            </button>
                        </div>

                        <div className="itinerary-container">
                            {tourForm.itinerary.map((day, index) => (
                                <div key={index} className="itinerary-day">
                                    <div className="day-header">
                                        <h4>Ngày {day.day}</h4>
                                        {tourForm.itinerary.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(index)}
                                                className="remove-day-btn"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>

                                    <div className="day-content">
                                        <div className="form-group">
                                            <label>Tiêu đề ngày *</label>
                                            <input
                                                type="text"
                                                value={day.title}
                                                onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                required
                                                placeholder="Ví dụ: Khám phá Hà Nội"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Mô tả chi tiết *</label>
                                            <textarea
                                                value={day.description}
                                                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                                required
                                                placeholder="Mô tả chi tiết các hoạt động trong ngày"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {tourForm.itinerary.length === 0 && (
                                <div className="no-itinerary">
                                    <p>Chưa có lịch trình nào. Nhấn "Thêm ngày" để bắt đầu.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Bao gồm *</label>
                            <textarea
                                name="includes"
                                value={tourForm.includes}
                                onChange={handleChange}
                                required
                                placeholder="Dịch vụ bao gồm"
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Không bao gồm *</label>
                            <textarea
                                name="excludes"
                                value={tourForm.excludes}
                                onChange={handleChange}
                                required
                                placeholder="Dịch vụ không bao gồm"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Phần input file cho hình ảnh */}
                    <div className="form-group">
                        <label>Hình ảnh</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
                        />
                        <div className="images-preview">
                            {tourForm.images.map((image, index) => (
                                <div key={index} className="image-preview-item">
                                    <img src={image.preview || image} alt={`Preview ${index}`} />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select name="status" value={tourForm.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Đang xử lý...' : (mode === 'add' ? 'Thêm Tour' : 'Cập nhật Tour')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TourModal;