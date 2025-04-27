import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';  // Importing play icon from react-icons

function Home() {
  const [buttonClicked, setButtonClicked] = useState(false);  // For handling the button click animation
  const navigate = useNavigate();  // Hook for navigation

  // Function to handle button click
  const handleClick = () => {
    setButtonClicked(true);  // Trigger animation
    setTimeout(() => {
      navigate('/dashboard');  // After the animation, navigate to dashboard
    }, 300);  // Match the timeout to the animation duration (300ms here)
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 relative"
      style={{
        background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('/background-pattern.png')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Optional Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Main Content */}
      <div className="z-10 text-center space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Heading with Animation */}
          <h1 className="text-3xl md:text-5xl font-bold text-emerald-500 animate__animated animate__fadeIn animate__delay-1s">
            Welcome to Tragoudi
          </h1>
          <img src="/gif/music_1.gif" alt="Music Animation" className="h-24 w-24 md:h-32 md:w-32" />
        </div>

        {/* Button with Click Animation */}
        <button
          onClick={handleClick}
          className={`bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 
            ${buttonClicked ? 'animate__animated animate__zoomOut' : 'animate__animated animate__fadeIn'} 
            animate__delay-2s cursor-pointer`}
        >
          Start Listening
        </button>
      </div>
    </div>
  );
}

export default Home;
