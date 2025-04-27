import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2';
import { HiOutlineMail, HiLockClosed } from 'react-icons/hi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [authError, setAuthError] = useState('');

  // Validate form inputs
  const validateForm = () => {
    if (!email || !password) {
      setFormError('Both fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    setFormError('');
    return true;
  };

  // Handle login action
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Attempt sign-in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setAuthError(signInError.message);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: signInError.message,
        });
        return;
      }

      // Fetch user data from 'users' table
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError) {
        setAuthError(fetchError.message);
        Swal.fire({
          icon: 'error',
          title: 'Data Fetch Error',
          text: fetchError.message,
        });
        return;
      }

      // Store user info in sessionStorage
      sessionStorage.setItem('userInfo', JSON.stringify(userData));

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Login successful. Redirecting...',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/dashboard'; // Redirect to the dashboard
      });

    } catch (err) {
      console.error('Unexpected error during login:', err);
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#121212]">
      <div className="w-[90%] max-w-md p-8  bg-[#1e1e1e]  rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <div className="flex items-center border border-gray-500 rounded-lg mt-2 bg-[#2d2d2d]">
              <HiOutlineMail className="text-gray-400 ml-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full p-3 text-white placeholder-gray-400 bg-transparent rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="flex items-center border border-gray-600 rounded-lg mt-2 bg-[#2d2d2d]">
              <HiLockClosed className="text-gray-400 ml-3" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full p-3 text-white placeholder-gray-400 bg-transparent rounded-lg outline-none"
              />
            </div>
          </div>

          {/* Form errors */}
          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          {authError && <p className="text-red-400 text-sm">{authError}</p>}

          {/* Submit Button */}
        <div className='flex justify-center items-center'>   <button
            type="submit"
            className="w-[70%] py-3 mt-4  text-black bg-[#1DB954]  font-semibold rounded-full hover:bg-[#1DB954] focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button></div>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-[#1DB954] hover:underline">Forgot Password?</a>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account? <a href="/signup" className="text-[#1DB954] hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
