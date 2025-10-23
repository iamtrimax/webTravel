import { useEffect } from "react";
import { useState } from "react";
import TourModal from "../TourModal/TourModal";
import TourCard from "../TourCard/TourCard";
import sumaryApi from "../../common";
import { toast } from "react-toastify";

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);


  // State cho form thêm/sửa tour
  const [tourForm, setTourForm] = useState({
    title: '',
    description: '',
    destination: '',
    mettingPoint: '',
    duration: 1,
    price: 0,
    discountPrice: 0,
    images: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    startDates: [],
    endDate: '',
    totalSlots: 0,
    bookedSlots: 0,
    tags: [],
    category: 'adventure',
    isActive: true
  });

  // Mock data - Thay thế bằng API call thực tế
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      // API call để lấy danh sách tour 
      const response = await fetch(sumaryApi.getAllTours.url, {
        method: sumaryApi.getAllTours.method,
        headers: {
          'Content-Type': 'application/json',
        }
      }); // Thay bằng endpoint thực tế

      const data = await response.json();
      setTours(data.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tour:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thêm tour mới
  const handleAddTour = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("add........");

    try {
      // API call để thêm tour 
      const response = await fetch(sumaryApi.createTour.url, {
        method: sumaryApi.createTour.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(tourForm)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Thêm tour thành công!');
        setTours([...tours, data]);
        fetchTours();
        setShowAddTourModal(false);
        resetTourForm();
      }
      else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error('Lỗi khi thêm tour:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật tour
  const handleUpdateTour = async (e) => {
    e.preventDefault();
    if (!selectedTour) return;

    setLoading(true);
    try {
      // API call để cập nhật tour
      const response = await fetch(sumaryApi.updateTour.url.replace(':id', selectedTour._id), {
        method: sumaryApi.updateTour.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(tourForm)
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      // Cập nhật tour trong state
      setTours(tours.map(tour => tour.id === selectedTour.id ? data.data : tour));
      setShowEditTourModal(false);
      setSelectedTour(null);
      resetTourForm();

    } catch (error) {
      console.error('Lỗi khi cập nhật tour:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xoá tour
  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Bạn có chắc muốn xoá tour này?')) return;

    try {
      // API call để xoá tour 
      const response = await fetch(sumaryApi.deleteTour.url.replace(':id', tourId), {
        method: sumaryApi.deleteTour.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if(data.error) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      // Cập nhật lại danh sách tour sau khi xoá
      setTours(tours.filter(tour => tour._id !== tourId));
    } catch (error) {
      console.error('Lỗi khi xoá tour:', error);
    }
  };

  // Xử lý cập nhật trạng thái tour
  const handleToggleStatus = async (tourId) => {
   
    try {
      // API call để cập nhật trạng thái
      const response = await fetch(sumaryApi.toggleTourStatus.url.replace(':id', tourId), {
        method: sumaryApi.toggleTourStatus.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.message);
        return;
      }
      toast.success('Cập nhật trạng thái thành công!');
      // Cập nhật trạng thái tour trong state
      setTours(tours.map(tour =>
        tour._id === tourId ? { ...tour, isActive: !tour.isActive } : tour
      ));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Lỗi khi cập nhật trạng thái!');
    }
  };

  // Mở modal chỉnh sửa tour
  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setTourForm({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      meetingPoint: tour.meetingPoint,
      duration: tour.duration,
      price: tour.price,
      discountPrice: tour.discountPrice,
      images: tour.images,
      itinerary: tour.itinerary,
      inclusions: tour.inclusions,
      exclusions: tour.exclusions,
      startDates: Array.isArray(tour.startDates)
        ? tour.startDates.map(d => d.split("T")[0]) // lấy phần yyyy-MM-dd
        : [],
      totalSlots: tour.totalSlots,
      tags: tour.tags,
      category: tour.category,
      isActive: tour.isActive
    });
    setShowEditTourModal(true);
  };

  // Reset form tour
  const resetTourForm = () => {
    setTourForm({
      title: '',
      description: '',
      destination: '',
      mettingPoint: '',
      duration: 1,
      price: 0,
      discountPrice: 0,
      images: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      startDates: [],
      endDate: '',
      totalSlots: 0,
      bookedSlots: 0,
      tags: [],
      category: 'adventure',
      isActive: true
    });
  };

  // Xử lý thêm tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      setTourForm({
        ...tourForm,
        tags: [...tourForm.tags, newTag]
      });
      e.target.value = '';
    }
  };

  // Xử lý xoá tag
  const handleRemoveTag = (tagToRemove) => {
    setTourForm({
      ...tourForm,
      tags: tourForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Lọc tours
  const filteredTours = tours.filter(tour => {
    const title = tour.title || '';
    const destination = tour.destination || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || tour.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' || (tour.isActive ? 'active' : 'inactive') === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });
  const getCategoryColor = (category) => {
    switch (category) {
      case 'adventure': return '#ff4444';
      case 'beach': return '#00d4ff';
      case 'cultural': return '#00C851';
      case 'mountain': return '#ffaa00';
      case 'city': return '#aa66cc';
      default: return '#888';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#00C851' : '#ff4444';
  };

  return (
    <div className="tour-management">
      <div className="tour-header">
        <h2>🏝️ Quản lý Tour</h2>
        <div className="tour-actions">
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm kiếm tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select-tour"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="adventure">Phiêu lưu</option>
              <option value="beach">Bãi biển</option>
              <option value="cultural">Văn hóa</option>
              <option value="mountain">Núi</option>
              <option value="city">Thành phố</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select-tour"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã ẩn</option>
            </select>
          </div>

          <button
            className="add-tour-btn"
            onClick={() => setShowAddTourModal(true)}
          >
            🆕 Thêm Tour Mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="tours-grid">
          {filteredTours.map(tour => (
            <TourCard
              key={tour._id}
              tour={tour}
              onEdit={handleEditTour}
              onDelete={handleDeleteTour}
              onToggleStatus={handleToggleStatus}
              getCategoryColor={getCategoryColor}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      )}

      {/* Modal thêm tour */}
      {showAddTourModal && (
        <TourModal
          mode="add"
          tourForm={tourForm}
          setTourForm={setTourForm}
          onSubmit={handleAddTour}
          onClose={() => { setShowAddTourModal(false); resetTourForm() }}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          loading={loading}
        />
      )}

      {/* Modal chỉnh sửa tour */}
      {showEditTourModal && (
        <TourModal
          mode="edit"
          tourForm={tourForm}
          setTourForm={setTourForm}
          onSubmit={handleUpdateTour}
          onClose={() => {
            setShowEditTourModal(false);
            setSelectedTour(null);
            resetTourForm();
          }}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          loading={loading}
        />
      )}
    </div>
  );
};
export default TourManagement;