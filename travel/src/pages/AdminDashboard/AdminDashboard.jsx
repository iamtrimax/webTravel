import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar,
  Menu,
  Bell,
  Search,
  ChevronDown,
  PieChart,
  TrendingUp,
  Activity
} from 'lucide-react';

// Thành phần biểu đồ
const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="flex items-end justify-between h-48">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1">{item.value}</div>
            <div
              className="w-10 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="h-48 relative">
        <svg viewBox={`0 0 ${data.length * 50} 100`} className="w-full h-full">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={data.map((item, i) => `${i * 50 + 25},${100 - (item.value / maxValue) * 80}`).join(' ')}
          />
          {data.map((item, i) => (
            <circle
              key={i}
              cx={i * 50 + 25}
              cy={100 - (item.value / maxValue) * 80}
              r="4"
              fill="#3b82f6"
            />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-2">
        {data.map((item, i) => (
          <div key={i} className="text-xs text-gray-500">{item.label}</div>
        ))}
      </div>
    </div>
  );
};

const PieChartComponent = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-48 h-48">
          {data.map((item, i) => {
            const percent = (item.value / total) * 100;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={-startPercent + 25}
              />
            );
          })}
        </svg>
      </div>
      <div className="mt-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center mb-2">
            <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">{item.name}: {item.value} ({(item.value / total * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  // Dữ liệu giả lập cho dashboard
  const statsData = [
    { title: 'Tổng Tour', value: '128', icon: MapPin, change: '+12%', changeType: 'positive' },
    { title: 'Đặt Tour', value: '564', icon: Calendar, change: '+23%', changeType: 'positive' },
    { title: 'Khách Hàng', value: '2,843', icon: Users, change: '+8%', changeType: 'positive' },
    { title: 'Doanh Thu', value: '12.8Tr', icon: DollarSign, change: '-3%', changeType: 'negative' },
  ];

  const recentBookings = [
    { id: 1, customer: 'Nguyễn Văn A', tour: 'Đà Nẵng - Hội An', date: '12/05/2023', status: 'Confirmed', price: '2,500,000' },
    { id: 2, customer: 'Trần Thị B', tour: 'Phú Quốc', date: '13/05/2023', status: 'Pending', price: '3,200,000' },
    { id: 3, customer: 'Lê Văn C', tour: 'Nha Trang', date: '14/05/2023', status: 'Cancelled', price: '2,800,000' },
    { id: 4, customer: 'Phạm Thị D', tour: 'Đà Lạt', date: '15/05/2023', status: 'Confirmed', price: '2,100,000' },
    { id: 5, customer: 'Hoàng Văn E', tour: 'Sapa', date: '16/05/2023', status: 'Confirmed', price: '3,500,000' },
  ];

  const tourStatus = [
    { name: 'Active', value: 42, color: '#10B981' },
    { name: 'Upcoming', value: 28, color: '#3B82F6' },
    { name: 'Completed', value: 58, color: '#8B5CF6' },
  ];

  // Dữ liệu biểu đồ
  const bookingData = [
    { label: 'T1', value: 65 },
    { label: 'T2', value: 78 },
    { label: 'T3', value: 90 },
    { label: 'T4', value: 81 },
    { label: 'T5', value: 56 },
    { label: 'T6', value: 64 },
  ];

  const revenueData = [
    { label: 'T1', value: 8.2 },
    { label: 'T2', value: 9.5 },
    { label: 'T3', value: 10.8 },
    { label: 'T4', value: 9.7 },
    { label: 'T5', value: 8.5 },
    { label: 'T6', value: 12.8 },
  ];

  const tourTypeData = [
    { name: 'Biển đảo', value: 45, color: '#3B82F6' },
    { name: 'Văn hóa', value: 30, color: '#10B981' },
    { name: 'Ẩm thực', value: 15, color: '#F59E0B' },
    { name: 'Thiên nhiên', value: 10, color: '#8B5CF6' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Tour Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-blue-700">
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="mt-6">
          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'dashboard' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('dashboard')}
          >
            <BarChart3 size={20} />
            {sidebarOpen && <span className="ml-3">Dashboard</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'tours' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('tours')}
          >
            <MapPin size={20} />
            {sidebarOpen && <span className="ml-3">Quản lý Tour</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'bookings' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('bookings')}
          >
            <Calendar size={20} />
            {sidebarOpen && <span className="ml-3">Đặt Tour</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'customers' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('customers')}
          >
            <Users size={20} />
            {sidebarOpen && <span className="ml-3">Khách Hàng</span>}
          </div>
          
          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'finance' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('finance')}
          >
            <DollarSign size={20} />
            {sidebarOpen && <span className="ml-3">Tài Chính</span>}
          </div>

          <div 
            className={`flex items-center px-4 py-3 ${activePage === 'reports' ? 'bg-blue-700' : 'hover:bg-blue-700'} cursor-pointer`}
            onClick={() => setActivePage('reports')}
          >
            <TrendingUp size={20} />
            {sidebarOpen && <span className="ml-3">Báo cáo</span>}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
                <button className="ml-2">
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">Tổng quan Dashboard</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Biểu đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <BarChart data={bookingData} title="Số lượng đặt tour theo tháng" />
            </div>
            <div className="lg:col-span-1">
              <PieChartComponent data={tourTypeData} title="Phân loại tour" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LineChart data={revenueData} title="Doanh thu theo tháng (triệu VNĐ)" />
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-4">Tour phổ biến</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Đà Nẵng - Hội An</span>
                    <span className="text-sm font-medium">128 bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Phú Quốc</span>
                    <span className="text-sm font-medium">98 bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Nha Trang</span>
                    <span className="text-sm font-medium">76 bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Đà Lạt</span>
                    <span className="text-sm font-medium">64 bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium">Đặt tour gần đây</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.tour}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'Confirmed' ? 'Xác nhận' : 
                             booking.status === 'Pending' ? 'Chờ xử lý' : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.price} VNĐ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Tour Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium">Trạng thái Tour</h3>
              </div>
              <div className="p-6">
                {tourStatus.map((status, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{status.name}</span>
                      <span className="text-sm font-medium">{status.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${status.value}%`, backgroundColor: status.color }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Thống kê doanh thu</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Tháng này</span>
                    <span className="text-sm font-bold">12.8Tr VNĐ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tháng trước</span>
                    <span className="text-sm font-bold">13.2Tr VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;