import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.scss';
import { jwtDecode } from 'jwt-decode';
import sumaryApi from '../../common';
import { toast } from 'react-toastify';
import TourSection from '../../components/TourSection/TourSection';
import DateSelection from '../../components/DateSelection/DateSelection';
import InfoCus from '../../components/InfoCus/InfoCus';
import PaymentMethod from '../../components/PaymentMethod/PaymentMethod';
import ConfirmSection from '../../components/ConfirmSection/ConfirmSection';

const Booking = () => {
  const [tours, setTours] = useState([])
  const [activeStep, setActiveStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingData, setBookingData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true); // ✅ Thêm loading state
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem("accessToken")
  const decoded = token ? jwtDecode(token) : ''

  // Thêm state cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    fullname: '',
    phone: '',
    address: '',
    specialRequests: ''
  });

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(sumaryApi.getAllTours.url, {
        method: sumaryApi.getAllTours.method,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      const activeTours = data.data.filter(tour => tour.isActive);
      setTours(activeTours);
      return activeTours;
    } catch (error) {
      console.error('Lỗi khi tải danh sách tour:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIX: Xử lý URL parameters độc lập với tours state
  useEffect(() => {
    const initializeBooking = async () => {
      const urlParams = new URLSearchParams(location.search);
      const tourId = urlParams.get('tourId');
      const selectedDate = urlParams.get('selectedDate');

      if (tourId) {
        // Nếu đã có tours, tìm tour ngay
        if (tours.length > 0) {
          const foundTour = tours.find(tour => tour._id === tourId);
          if (foundTour) {
            setSelectedTour(foundTour);
            setActiveStep(2);
            if (selectedDate) {
              setBookingDate(selectedDate);
            }
          }
        } else {
          // Nếu chưa có tours, fetch tours trước
          const toursData = await fetchTours();
          const foundTour = toursData.find(tour => tour._id === tourId);
          if (foundTour) {
            setSelectedTour(foundTour);
            setActiveStep(2);
            if (selectedDate) {
              setBookingDate(selectedDate);
            }
          }
        }
      } else {
        // Nếu không có tourId, chỉ fetch tours bình thường
        await fetchTours();
      }
    };

    initializeBooking();
  }, [location.search]); // ✅ Chỉ phụ thuộc vào location.search
  // Categories data
  const categories = [
    { id: 'all', name: 'Tất Cả', count: tours.length, icon: '🌍' },
    { id: 'beach', name: 'Biển', count: tours.filter(tour => tour.category === 'beach').length, icon: '🏖️' },
    { id: 'mountain', name: 'Núi', count: tours.filter(tour => tour.category === 'mountain').length, icon: '⛰️' },
    { id: 'adventure', name: 'Phiêu Lưu', count: tours.filter(tour => tour.category === 'adventure').length, icon: '🧗' },
    { id: 'cultural', name: 'Văn Hóa', count: tours.filter(tour => tour.category === 'cultural').length, icon: '🏯' },
    { id: 'city', name: 'Thành Phố', count: tours.filter(tour => tour.category === 'city').length, icon: '🏙️' }
  ];

  // Filter tours based on search and category
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Cập nhật steps để thêm bước thông tin khách hàng
  const steps = [
    { number: 1, title: 'Chọn Tour', icon: '🗺️' },
    { number: 2, title: 'Chọn Ngày & Số Lượng', icon: '📅' },
    { number: 3, title: 'Thông Tin Khách Hàng', icon: '👤' },
    { number: 4, title: 'Thanh Toán', icon: '💳' },
    { number: 5, title: 'Xác Nhận', icon: '✅' }
  ];

  const handleTourSelect = (tour) => {
    if (!token) {
      alert("Bạn cần phải đăng nhập để đặt tour")
      navigate("/login")
      return;
    }
    setSelectedTour(tour);
    setActiveStep(2);
  };

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm kiểm tra thông tin khách hàng đã đầy đủ chưa
  const isCustomerInfoValid = () => {
    return customerInfo.fullname.trim() !== '' &&
      customerInfo.phone.trim() !== '' &&
      customerInfo.address.trim() !== '';
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("chạy................");

      if (paymentMethod === 'banking') {
        const data = {
          tourId: selectedTour._id,
          bookingDate: new Date(bookingDate).toString(),
          bookingSlots: travelers,
          fullname: customerInfo.fullname,
          phone: customerInfo.phone,
          address: customerInfo.address,
          specialRequire: customerInfo.specialRequests
        }
        const fetchPayOS = await fetch(sumaryApi.paymentPayOS.url, {
          method: sumaryApi.paymentPayOS.method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },

          redirect: "manual",

          body: JSON.stringify(data)
        })
        const dataPayOS = await fetchPayOS.json()
        if (dataPayOS.success) {
          const bookingData = {
            ...dataPayOS.bookingData,
            tour: selectedTour // lưu luôn tour hiện tại frontend
          };
          localStorage.setItem("data-booking", JSON.stringify(bookingData));
          window.location.href = dataPayOS.data;

          return;
        } else {
          toast.error(dataPayOS.message)
          return;
        }
      }
      const fetchBooking = await fetch(sumaryApi.booking.url, {
        method: sumaryApi.booking.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          tourId: selectedTour._id,
          bookingDate: new Date(bookingDate).toString(),
          bookingSlots: travelers,
          fullname: customerInfo.fullname,
          phone: customerInfo.phone,
          address: customerInfo.address,
          specialRequire: customerInfo.specialRequests
        })
      })
      const data = await fetchBooking.json()
      if (data.success) {
        toast.success(data.message)
        setBookingData(data.data);
        setActiveStep(5);
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt tour');
      console.error('Booking error:', error);
    }
  };


  const handleTravelersChange = (amount) => {
    setTravelers(prev => Math.max(1, prev + amount));
  };
  useEffect(() => {
    // lấy data
    const data = JSON.parse(localStorage.getItem("data-booking"))
    console.log("idbooking", data?.idBooking);

    if (data?.idBooking) {
      setBookingData(data);
      setActiveStep(5);
      // Xoá localStorage nếu cần
      localStorage.removeItem('data-booking');
    }
  }, []);
  // ✅ FIX: Thêm loading state cho toàn bộ page
  if (isLoading) {
    return (
      <div className="booking-page">
        <section className="booking-header">
          <div className="container">
            <h1 className="page-title">Đặt Tour Du Lịch</h1>
          </div>
        </section>
        <div className="loading-container">
          <div className="spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header Section */}
      <section className="booking-header">
        <div className="container">
          <h1 className="page-title">Đặt Tour Du Lịch</h1>
          <p className="page-subtitle">Trải nghiệm hành trình tuyệt vời với dịch vụ đặt tour dễ dàng</p>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="booking-steps">
        <div className="container">
          <div className="steps-container">
            {steps.map(step => (
              <div key={step.number} className={`step-item ${activeStep >= step.number ? 'active' : ''}`}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <div className="step-number">Bước {step.number}</div>
                  <div className="step-title">{step.title}</div>
                </div>
                {step.number < steps.length && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 1: Tour Selection - CHỈ HIỆN KHI KHÔNG CÓ TOUR TỪ URL */}
      {/* Step 1: Tour Selection */}
      {activeStep === 1 && (
        <TourSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filteredTours={filteredTours}
          handleTourSelect={handleTourSelect}
        />
      )}

      {/* Step 2: Date & Travelers Selection */}
      {activeStep === 2 && selectedTour && (
        <DateSelection
          selectedTour={selectedTour}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          travelers={travelers}
          handleTravelersChange={handleTravelersChange}
          setActiveStep={setActiveStep}
          setSelectedTour={setSelectedTour}
          navigate={navigate}
        />

      )}

      {/* Step 3: Customer Information */}
      {activeStep === 3 && selectedTour && (
        <InfoCus
          customerInfo={customerInfo}
          handleCustomerInfoChange={handleCustomerInfoChange}
          isCustomerInfoValid={isCustomerInfoValid}
          setActiveStep={setActiveStep}

        />
      )}

      {/* Step 4: Payment */}
      {activeStep === 4 && selectedTour && (
        <PaymentMethod
          selectedTour={selectedTour}
          bookingDate={bookingDate}
          travelers={travelers}
          customerInfo={customerInfo}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setActiveStep={setActiveStep}
          handleBookingSubmit={handleBookingSubmit}
        />
      )}

      {/* Step 5: Confirmation */}
      {activeStep === 5 && bookingData && (
        <ConfirmSection
          bookingData={bookingData}
          decoded={decoded}
        />
      )}
    </div>
  );
};

export default Booking;