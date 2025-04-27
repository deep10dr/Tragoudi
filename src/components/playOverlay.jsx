import React from 'react';

const PlayOverlay = ({ isVisible }) => {
  return (
    <div
    className={`absolute inset-0 bg-opacity-50 flex items-end justify-end p-2 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
  >
    <img
      src="https://cdn-icons-png.flaticon.com/128/9432/9432214.png"
      alt="Play"
      className="w-10 h-10 bg-black p-2 rounded-2xl"
    />
  </div>
  );
};

export default PlayOverlay;
