import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sumaryApi from "../../common";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const token = query.get("token");
  const uid = query.get("id");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // lỗi cho từng field

  if (!token || !uid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg font-semibold">
          Link đặt lại mật khẩu không hợp lệ.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (password.length < 6) {
      validationErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (password !== confirm) {
      validationErrors.confirm = "Mật khẩu nhập lại không khớp";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
        const res = await fetch(sumaryApi.resetPassword.url, {
        method: sumaryApi.resetPassword.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: uid,    
            token: token,
            newPassword: password,
        })
      })
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Đặt lại mật khẩu thành công");
        navigate(`${data.role==='admin'?'/admin/login' : '/login'}`);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đặt lại mật khẩu
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Mật khẩu mới */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu mới"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.confirm ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập lại mật khẩu mới"
            />
            {errors.confirm && (
              <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-2 px-4 rounded-lg 
              hover:bg-blue-700 transition
              disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
