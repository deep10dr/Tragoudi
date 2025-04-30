import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Swal from 'sweetalert2'
import { HiOutlineMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    if (!email || !password || !name) {
      setFormError('All fields are required.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.')
      return false
    }

    setFormError(null)
    return true
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
        background: '#121212',
        color: '#fff',
        confirmButtonColor: '#1DB954',
      })
    } else {
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name,
            email,
            password,
            role: 'user',
            plan: 'free',
          },
        ])

      if (insertError) {
        setError(insertError.message)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: insertError.message,
          background: '#121212',
          color: '#fff',
          confirmButtonColor: '#1DB954',
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Redirecting to login...',
          background: '#121212',
          color: '#fff',
          confirmButtonColor: '#1DB954',
        }).then(() => {
          window.location.href = '/login'
        })
      }
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#121212]">
      <div className="w-[90%] max-w-md p-8 bg-[#1e1e1e] rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Create your account</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
            <div className="flex items-center border border-gray-600 rounded-lg mt-2 bg-[#2a2a2a]">
              <HiUser className="text-[#1DB954] ml-3" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-transparent text-white rounded-lg outline-none placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <div className="flex items-center border border-gray-600 rounded-lg mt-2 bg-[#2a2a2a]">
              <HiOutlineMail className="text-[#1DB954] ml-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-transparent text-white rounded-lg outline-none placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <div className="flex items-center border border-gray-600 rounded-lg mt-2 bg-[#2a2a2a]">
              <HiLockClosed className="text-[#1DB954] ml-3" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-transparent text-white rounded-lg outline-none placeholder-gray-500"
                placeholder="Enter your password"
              />
              <div
                className="mr-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff className="text-gray-400" /> : <HiEye className="text-gray-400" />}
              </div>
            </div>
          </div>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className='flex justify-center items-center'><button
            type="submit"
            className="w-[60%] py-3 bg-[#1DB954] text-black font-semibold rounded-full mt-4 hover:opacity-90 transition duration-200 cursor-pointer"
          >
            Sign Up
          </button></div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account? <a href="/login" className="text-[#1DB954] hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
