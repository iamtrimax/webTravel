import { useRef, useState } from "react";
import uploadImage from "../../helper/uploadImage";
import sumaryApi from "../../common";

const TourModal = ({
  mode,
  tourForm,
  setTourForm,
  onSubmit,
  onClose,
  onAddTag,
  onRemoveTag,
  loading,
}) => {
  const [tempImages, setTempImages] = useState([]);
  const fileInputRef = useRef(null);

  // Xử lý input thay đổi
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setTourForm({
      ...tourForm,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  // Upload ảnh
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const results = await Promise.all(files.map((file) => uploadImage(file)));
      const images = results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));

      setTempImages((prev) => [...prev, ...images]);
      setTourForm((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    } catch (err) {
      console.error("Upload thất bại:", err);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = async (index) => {
    const image = tourForm.images[index];
    try {
      await fetch(sumaryApi.deleteImage.url, {
        method: sumaryApi.deleteImage.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ public_id: image.public_id }),
      });

      setTourForm({
        ...tourForm,
        images: tourForm.images.filter((_, i) => i !== index),
      });
    } catch (err) {
      console.error("Xoá ảnh thất bại:", err);
    }
  };

  // Thay đổi lịch trình
  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = tourForm.itinerary.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setTourForm({ ...tourForm, itinerary: updatedItinerary });
  };

  const addItineraryDay = () => {
    const newDay = {
      day: tourForm.itinerary.length + 1,
      title: "",
      description: "",
    };
    setTourForm({ ...tourForm, itinerary: [...tourForm.itinerary, newDay] });
  };

  const removeItineraryDay = (index) => {
    const updatedItinerary = tourForm.itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));

    setTourForm({ ...tourForm, itinerary: updatedItinerary });
  };

  // Hủy modal và xóa ảnh đã upload tạm
  const handleCancelAddTour = async () => {
    try {
      if (tempImages.length > 0) {
        for (const img of tempImages) {
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
    } catch (err) {
      console.error("Xoá ảnh thất bại:", err);
    } finally {
      setTempImages([]);
      if (onClose) onClose();
    }
  };

  const onCloseModal = async () => {
    await handleCancelAddTour();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>{mode === "add" ? "Thêm Tour Mới" : "Chỉnh sửa Tour"}</h3>
          <button className="close-btn" onClick={onCloseModal}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="tour-form">
          {/* ===== Thông tin cơ bản ===== */}
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
                name="meetingPoint"
                value={tourForm.meetingPoint}
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
              <label>Giảm giá</label>
              <input
                type="number"
                name="discountPrice"
                value={tourForm.discountPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ===== Ngày khởi hành ===== */}
          <div className="form-group">
            <label>Ngày bắt đầu *</label>
            <button
              type="button"
              onClick={() =>
                setTourForm({
                  ...tourForm,
                  startDates: [...tourForm.startDates, ""],
                })
              }
              className="add-day-btn"
            >
              + Thêm ngày
            </button>

            <div className="startDatess-container">
              {tourForm.startDates.map((date, index) => (
                <div key={index} className="startDate-item">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => {
                      const updated = [...tourForm.startDates];
                      updated[index] = e.target.value;
                      setTourForm({ ...tourForm, startDates: updated });
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="remove-day-btn"
                    onClick={() => {
                      const updated = tourForm.startDates.filter(
                        (_, i) => i !== index
                      );
                      setTourForm({ ...tourForm, startDates: updated });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {tourForm.startDates.length === 0 && (
                <p className="no-date">Chưa có ngày nào. Nhấn "Thêm ngày".</p>
              )}
            </div>
          </div>

          {/* ===== Vé & Danh mục ===== */}
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
              <select
                name="category"
                value={tourForm.category}
                onChange={handleChange}
              >
                <option value="adventure">phiêu lưu</option>
                <option value="beach">bãi biển</option>
                <option value="cultural">văn hóa</option>
                <option value="mountain">núi</option>
                <option value="city">thành phố</option>
              </select>
            </div>
          </div>

          {/* ===== Tags ===== */}
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
                  <button type="button" onClick={() => onRemoveTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* ===== Lịch trình ===== */}
          <div className="form-group">
            <div className="itinerary-header">
              <label>Lịch trình *</label>
              <button
                type="button"
                onClick={addItineraryDay}
                className="add-day-btn"
              >
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
                        onChange={(e) =>
                          handleItineraryChange(index, "title", e.target.value)
                        }
                        required
                        placeholder="Ví dụ: Khám phá Hà Nội"
                      />
                    </div>

                    <div className="form-group">
                      <label>Mô tả chi tiết *</label>
                      <textarea
                        value={day.description}
                        onChange={(e) =>
                          handleItineraryChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
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

          {/* ===== Includes & Excludes ===== */}
          <div className="form-row">
            <div className="form-group">
              <label>Bao gồm *</label>
              {tourForm.inclusions.map((item, index) => (
                <div key={index} className="array-input-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...tourForm.inclusions];
                      updated[index] = e.target.value;
                      setTourForm({ ...tourForm, inclusions: updated });
                    }}
                    placeholder={`Mục ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = tourForm.inclusions.filter(
                        (_, i) => i !== index
                      );
                      setTourForm({ ...tourForm, inclusions: updated });
                    }}
                    className="remove-day-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setTourForm({ ...tourForm, inclusions: [...tourForm.inclusions, ""] })
                }
                className="add-day-btn"
              >
                + Thêm mục
              </button>
            </div>

            <div className="form-group">
              <label>Không bao gồm *</label>
              {tourForm.exclusions.map((item, index) => (
                <div key={index} className="array-input-item">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...tourForm.exclusions];
                      updated[index] = e.target.value;
                      setTourForm({ ...tourForm, exclusions: updated });
                    }}
                    placeholder={`Mục ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = tourForm.exclusions.filter(
                        (_, i) => i !== index
                      );
                      setTourForm({ ...tourForm, exclusions: updated });
                    }}
                    className="remove-day-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setTourForm({ ...tourForm, exclusions: [...tourForm.exclusions, ""] })
                }
                className="add-day-btn"
              >
                + Thêm mục
              </button>
            </div>
          </div>

          {/* ===== Ảnh ===== */}
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
                  <img
                    src={image.preview || image.url}
                    alt={`Preview ${index}`}
                  />
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

          {/* ===== Trạng thái ===== */}
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="isActive"
              value={tourForm.isActive ? "active" : "inactive"}
              onChange={handleChange}
            >
              <option value="active">Kích hoạt</option>
              <option value="inactive">Ẩn</option>
            </select>
          </div>

          {/* ===== Actions ===== */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onCloseModal}
              className="cancel-btn"
            >
              Hủy
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading
                ? "Đang xử lý..."
                : mode === "add"
                ? "Thêm Tour"
                : "Cập nhật Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourModal;
