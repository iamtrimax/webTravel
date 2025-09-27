import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import sumaryApi from '../common';
import { Outlet, useNavigate } from 'react-router-dom';
import { clearUser } from '../Store/userSlice';
import Header from '../componets/Header/Header';
import Footer from '../componets/Footer/Footer';

const Layout = () => {
    const user = useSelector((state) => state?.user?.user);
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const onAuthClick = (path) => {
        navigator(path);
    }
    const onLogOut = async () => {
        const res = await fetch(sumaryApi.logout.url, {
            method: sumaryApi.logout.method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });
        const data = await res.json();
        if (data.success) {
            localStorage.removeItem("accessToken");
            dispatch(clearUser());
            navigator("/");
        }
    }
    return (
        <div className='flex flex-col min-h-screen'>
            <Header onAuthClick={onAuthClick} user={user} onLogout={onLogOut} />
            <main className='main'>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout