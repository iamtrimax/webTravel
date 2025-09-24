import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../Context/Context';

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state?.user?.user);
  const { loadingUser } = useContext(Context);

  // Nếu đang load user từ API thì show loading
  if (loadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Sau khi load xong mà không có quyền
  if (!user || user?.role !== 'admin') {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default AdminRoute;
