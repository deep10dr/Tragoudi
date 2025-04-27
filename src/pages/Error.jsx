import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white px-6">
      <FaExclamationTriangle className="text-[#1DB954] text-6xl mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Something went wrong.</h1>
      <p className="text-lg text-gray-400 mb-8 text-center">
        We're having trouble loading this page. Please try again later.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 bg-[#1DB954] text-black font-semibold rounded-full hover:opacity-90 transition cursor-pointer"
      >
        Go Home
      </button>
    </div>
  );
}

export default Error;
