import { useEffect } from "react";
import { useState } from "react";
import TourModal from "../TourModal/TourModal";
import TourCard from "../TourCard/TourCard";

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
    pickupPoint: '',
    duration: 1,
    price: 0,
    discount: 0,
    images: [],
    itinerary: [],
    includes: '',
    excludes: '',
    startDate: '',
    endDate: '',
    totalSlots: 0,
    bookedSlots: 0,
    tags: [],
    category: 'adventure',
    status: 'active'
  });

  // Mock data - Thay thế bằng API call thực tế
  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      // Giả lập API call - Thay bằng API thực tế
      const mockTours = [
        {
          id: 1,
          title: 'Tour Đà Nẵng - Hội An 4 Ngày 3 Đêm',
          description: 'Khám phá thành phố đáng sống nhất Việt Nam',
          destination: 'Đà Nẵng, Hội An',
          pickupPoint: 'Sân bay Đà Nẵng',
          duration: 4,
          price: 3500000,
          discount: 10,
          images: ['logo', 'da-nang-2.jpg'],
          itinerary: [{ day: 1, title: 'Khám Phá Bà Nà Hills', description: 'Đón sân bay - Bà Nà Hills...' }],
          includes: 'Khách sạn 3*, ăn sáng, vé tham quan',
          excludes: 'Ăn trưa, ăn tối, chi phí cá nhân',
          startDate: '2024-02-01',
          endDate: '2024-12-31',
          totalSlots: 50,
          bookedSlots: 25,
          tags: ['biển', 'văn hóa', 'ẩm thực'],
          category: 'cultural',
          status: 'active',
          createdAt: '2024-01-01',
          rating: 4.8
        },
        {
          id: 2,
          title: 'Tour Sapa Trekking 3 Ngày 2 Đêm',
          description: 'Trải nghiệm trekking qua các bản làng dân tộc',
          destination: 'Sapa, Lào Cai',
          pickupPoint: 'Ga Lào Cai',
          duration: 3,
          price: 2500000,
          discount: 15,
          images: ['sapa-1.jpg', 'sapa-2.jpg'],
          itinerary: [{ day: 1, title: 'Khám Phá Sapa', description: 'Hà Nội - Sapa - Cat Cat...' }],
          includes: 'Homestay, hướng dẫn viên, bảo hiểm',
          excludes: 'Xe cá nhân, đồ uống có cồn',
          startDate: '2024-02-15',
          endDate: '2024-11-30',
          totalSlots: 30,
          bookedSlots: 28,
          tags: ['trekking', 'núi rừng', 'dân tộc'],
          category: 'adventure',
          status: 'active',
          createdAt: '2024-01-05',
          rating: 4.9
        },
        {
          id: 3,
          title: 'Tour Phú Quốc 5 Ngày 4 Đêm',
          description: 'Thiên đường biển đảo miền Nam',
          destination: 'Phú Quốc, Kiên Giang',
          pickupPoint: 'Sân bay Phú Quốc',
          duration: 5,
          price: 5000000,
          discount: 5,
          images: ['phu-quoc-1.jpg', 'phu-quoc-2.jpg'],
          itinerary: [{ day: 1, title: 'Khám Phá Đảo Ngọc', description: 'Đảo ngọc - Bãi Sao...' }],
          includes: 'Resort 4*, ăn sáng, tour đảo',
          excludes: 'Massage, spa, golf',
          startDate: '2024-03-01',
          endDate: '2024-10-31',
          totalSlots: 40,
          bookedSlots: 15,
          tags: ['biển', 'nghỉ dưỡng', 'ẩm thực'],
          category: 'beach',
          status: 'inactive',
          createdAt: '2024-01-10',
          rating: 4.7
        }
      ];
      setTours(mockTours);
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
    
    try {
      // API call để thêm tour - Thay bằng API thực tế
      const tourData = {
        ...tourForm,
        id: tours.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        bookedSlots: 0,
        rating: 0
      };

      setTours([...tours, tourData]);
      setShowAddTourModal(false);
      resetTourForm();
      
      alert('Thêm tour thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm tour:', error);
      alert('Lỗi khi thêm tour!');
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
      // API call để cập nhật tour - Thay bằng API thực tế
      setTours(tours.map(tour => 
        tour.id === selectedTour.id ? { ...tour, ...tourForm } : tour
      ));
      setShowEditTourModal(false);
      setSelectedTour(null);
      resetTourForm();
      
      alert('Cập nhật tour thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật tour:', error);
      alert('Lỗi khi cập nhật tour!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xoá tour
  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Bạn có chắc muốn xoá tour này?')) return;

    try {
      // API call để xoá tour - Thay bằng API thực tế
      setTours(tours.filter(tour => tour.id !== tourId));
      alert('Xoá tour thành công!');
    } catch (error) {
      console.error('Lỗi khi xoá tour:', error);
      alert('Lỗi khi xoá tour!');
    }
  };

  // Xử lý cập nhật trạng thái tour
  const handleToggleStatus = async (tourId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      // API call để cập nhật trạng thái - Thay bằng API thực tế
      setTours(tours.map(tour => 
        tour.id === tourId ? { ...tour, status: newStatus } : tour
      ));
      alert(`${newStatus === 'active' ? 'Kích hoạt' : 'Ẩn'} tour thành công!`);
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
      pickupPoint: tour.pickupPoint,
      duration: tour.duration,
      price: tour.price,
      discount: tour.discount,
      images: tour.images,
      itinerary: tour.itinerary,
      includes: tour.includes,
      excludes: tour.excludes,
      startDate: tour.startDate,
      endDate: tour.endDate,
      totalSlots: tour.totalSlots,
      bookedSlots: tour.bookedSlots,
      tags: tour.tags,
      category: tour.category,
      status: tour.status
    });
    setShowEditTourModal(true);
  };

  // Reset form tour
  const resetTourForm = () => {
    setTourForm({
      title: '',
      description: '',
      destination: '',
      pickupPoint: '',
      duration: 1,
      price: 0,
      discount: 0,
      images: [],
      itinerary: [],
      includes: '',
      excludes: '',
      startDate: '',
      endDate: '',
      totalSlots: 0,
      bookedSlots: 0,
      tags: [],
      category: 'adventure',
      status: 'active'
    });
  };

  // Xử lý thêm tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
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
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tour.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || tour.status === statusFilter;
    
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

  const getStatusColor = (status) => {
    return status === 'active' ? '#00C851' : '#ff4444';
  };

  const calculateFinalPrice = (price, discount) => {
    return price - (price * discount / 100);
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
              <option value="adventure">Adventure</option>
              <option value="beach">Beach</option>
              <option value="cultural">Cultural</option>
              <option value="mountain">Mountain</option>
              <option value="city">City</option>
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
              key={tour.id}
              tour={tour}
              onEdit={handleEditTour}
              onDelete={handleDeleteTour}
              onToggleStatus={handleToggleStatus}
              getCategoryColor={getCategoryColor}
              getStatusColor={getStatusColor}
              calculateFinalPrice={calculateFinalPrice}
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
          onClose={() => {setShowAddTourModal(false); resetTourForm()}}
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