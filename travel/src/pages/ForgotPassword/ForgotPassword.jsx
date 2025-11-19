import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';
import sumaryApi from '../../common';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [clicked, setClicked] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gửi yêu cầu đặt lại mật khẩu
        const requestResetPassword = await fetch(sumaryApi.forgotPassword.url, {
            method: sumaryApi.forgotPassword.method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),  

        });
        const response = await requestResetPassword.json();
        if (response.success){
            toast.success(response.message);
            setClicked(true);
        }
        else{
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Quên mật khẩu
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 `}
                        />
                    </div>
                    {/* Submit */}
                    <button
                        type="submit"
                        className="
                                w-full bg-blue-600 text-white py-2 px-4 rounded-lg 
                                hover:bg-blue-700 transition
                                disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60
    "
                        disabled={clicked}
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword