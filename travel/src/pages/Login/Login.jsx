import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "../../Context/Context";
import socket, { connectSocket } from "../../Socket/Socket";
import sumaryApi from "../../common";
import { jwtDecode } from "jwt-decode";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUserDetails } = useContext(Context);
  const navigator = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors(false)
    setSubmitError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.email) newErrors.email = "Vui lòng nhập email";
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Gọi API đăng nhập tại đây
      const res = await fetch(sumaryApi.login.url, {
        method: sumaryApi.login.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const data = await res.json();
      if (data.success) {
        // Đăng nhập thành công xử lý logic ở đây
        localStorage.setItem("accessToken", data.data.accessToken);
        navigator("/");
        fetchUserDetails();

        connectSocket()
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });
        socket.on("blocked", (data) => {
          alert(data.message);
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        });
      } else {
        // Đăng nhập thất bại xử lý logic ở đây
        setErrors(data.message || {});
        setSubmitError(true);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Đăng nhập
        </h2>
        {submitError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 text-sm">  {typeof errors === "string" ? errors : JSON.stringify(errors)}</div>

        )}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            {/* Toggle password visibility*/}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-8 text-sm px-2 py-1 rounded-md focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Nhớ mật khẩu
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>

        {/* Link register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
