import { LogOut } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaShieldAlt,
    FaCalendarAlt,
    FaCreditCard,
    FaEdit,
    FaSignInAlt,
    FaUserPlus,
} from 'react-icons/fa';
import Swal from 'sweetalert2';

function Account() {
    const [data, setData] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
        const date = new Date(dateString);
        const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
        return istDate.toLocaleDateString('en-IN', options).replace(/,/g, '').toUpperCase();
    };

    const formatFullDateWithTime = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        const date = new Date(dateString);
        const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
        return istDate.toLocaleString('en-IN', options).replace(/,/g, '').toUpperCase();
    };

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            setData(JSON.parse(userInfo));
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1db954',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log me out!',
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#121212] p-6">
            <div className="bg-[#1d1d1d] shadow-lg rounded-3xl p-8 w-full max-w-md text-white">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-[#333] flex items-center justify-center text-4xl font-bold text-white mb-6">
                        DP
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-center">
                        {data ? 'Your Account' : 'Please Log In'}
                    </h2>
                    <p className="text-gray-400 mb-6 text-center">
                        {data ? 'Manage your account information and preferences' : 'Sign in to access your account'}
                    </p>

                    <div className="w-full space-y-4">
                        {data ? (
                            <>
                                <div className="flex justify-between items-center text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="h-5 w-5 text-[#1db954]" />
                                        <span className="font-medium">Name:</span>
                                    </div>
                                    <span>{data?.name || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="h-5 w-5 text-[#1db954]" />
                                        <span className="font-medium">Email:</span>
                                    </div>
                                    <span>{data?.email || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaShieldAlt className="h-5 w-5 text-[#1db954]" />
                                        <span className="font-medium">Role:</span>
                                    </div>
                                    <span>{data?.role || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaCreditCard className="h-5 w-5 text-[#1db954]" />
                                        <span className="font-medium">Plan:</span>
                                    </div>
                                    <span>{data?.plan || 'Loading...'}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="h-5 w-5 text-[#1db954]" />
                                        <span className="font-medium">Created:</span>
                                    </div>
                                    <span
                                        className="cursor-pointer hover:text-[#1db954] transition"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        {isHovered
                                            ? formatFullDateWithTime(data?.created_at)
                                            : formatDate(data?.created_at)}
                                    </span>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 w-full">
                                    <button className="w-full md:w-1/2 bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-2 rounded-md transition flex items-center justify-center gap-2 cursor-pointer">
                                        <FaEdit className="h-5 w-5" />
                                        Edit Profile
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full md:w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Log Out
                                    </button>
                                </div>

                            </>
                        ) : (
                            <div className="flex gap-4 w-[90%] justify-center items-center">
                                <button
                                    className="flex items-center justify-center gap-2 w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-2 rounded-md transition cursor-pointer"
                                    onClick={() => (window.location.href = '/login')}
                                >
                                    <FaSignInAlt className="h-5 w-5" />
                                    Log In
                                </button>
                                <button
                                    className="flex items-center justify-center gap-2 w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-2 rounded-md transition cursor-pointer"
                                    onClick={() => (window.location.href = '/signup')}
                                >
                                    <FaUserPlus className="h-5 w-5" />
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
