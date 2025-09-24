import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Page403 = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full border-4 border-white shadow-sm">
            <svg 
              className="w-10 h-10 text-red-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
        </div>

        {/* Error Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Truy Cập Bị Từ Chối
          </h2>
          <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-gray-600 leading-relaxed">
            Bạn không có quyền truy cập trang này. 
            Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">          
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page403;