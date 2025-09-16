import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import sumaryApi from "../../common";

// Component: RegisterForm
// Usage: import RegisterForm from './RegisterForm_tailwind_react.jsx'
// Drop into any React app that already has Tailwind CSS configured.

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // Simple validators
  const validate = (values) => {
    const errs = {};
    // email
    if (!values.email) errs.email = "Vui lòng nhập email.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Email không hợp lệ.";

    // username
    if (!values.username) errs.username = "Vui lòng nhập username.";
    else if (values.username.length < 3) errs.username = "Username phải có ít nhất 3 ký tự.";

    // password
    if (!values.password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (values.password.length < 8) errs.password = "Mật khẩu phải ít nhất 8 ký tự.";

    // confirm password
    if (!values.confirmPassword) errs.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    else if (values.confirmPassword !== values.password) errs.confirmPassword = "Mật khẩu xác nhận không khớp.";

    return errs;
  };

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setSubmitError(false);
    setSubmitted(false);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const canSubmit = Object.keys(errors).length === 0 && Object.values(form).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, username: true, password: true, confirmPassword: true });
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length === 0) {
      //api register
      try {
        const res = await fetch(sumaryApi.register.url, {
          method: sumaryApi.register.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          // handle success
          setSubmitted(true);
          setForm((p) => ({ ...p, password: "", confirmPassword: "" }));
        } else {
          // handle error
          setErrors(true)
          setSubmitError(true);
          setErrors(data.message || {});
        }
      } catch (error) {
        console.error("Error:", error);
      }
      // reset password fields after submit for safety
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Đăng ký tài khoản</h2>
        <p className="text-sm text-gray-500 mb-6">Nhập thông tin để tạo tài khoản mới.</p>

        {submitted && (
          <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 text-sm">Đăng ký thành công! Quay lại trang <Link to="/login" className="!text-blue-500 hover:underline">Đăng nhập</Link>.</div>
        )}
        {submitError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 text-sm">  {typeof errors === "string" ? errors : JSON.stringify(errors)}</div>

        )}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.email && touched.email ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200"
                }`}
              placeholder="you@example.com"
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-xs mt-1 text-red-600">{errors.email}</p>
            )}
          </label>

          {/* Username */}
          <label className="block mb-3">
            <span className="text-sm font-medium text-gray-700">Username</span>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.username && touched.username ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200"
                }`}
              placeholder="Tên đăng nhập"
            />
            {errors.username && touched.username && (
              <p id="username-error" className="text-xs mt-1 text-red-600">{errors.username}</p>
            )}
          </label>

          {/* Password */}
          <label className="block mb-3 relative">
            <span className="text-sm font-medium text-gray-700">Mật khẩu</span>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.password && touched.password ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200"
                }`}
              placeholder="Ít nhất 8 ký tự"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-8 text-sm px-2 py-1 rounded-md focus:outline-none"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
            {errors.password && touched.password && (
              <p id="password-error" className="text-xs mt-1 text-red-600">{errors.password}</p>
            )}
          </label>

          {/* Confirm Password */}
          <label className="block mb-4 relative">
            <span className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</span>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              className={`mt-1 block w-full rounded-lg border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.confirmPassword && touched.confirmPassword ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-indigo-200"
                }`}
              placeholder="Nhập lại mật khẩu"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p id="confirmPassword-error" className="text-xs mt-1 text-red-600">{errors.confirmPassword}</p>
            )}
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded-lg text-white font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${canSubmit ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400"
              }`}
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Đã có tài khoản? <Link to={"/login"} className="text-indigo-600 hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
export default SignUp;