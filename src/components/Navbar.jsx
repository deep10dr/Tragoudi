import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHeart, FaUser, FaSearch, FaHeadphones, FaBars } from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { IoMdCloudUpload } from "react-icons/io";

function Navbar({ onSongSelect }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [admin_user,Set_admin_user]= useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  function handleChange(e) {
    setSearch(e.target.value);
    finder(e.target.value);
  }

  async function finder(val) {
    if (val.trim() === '') {
      setSearchResults([]);
      return;
    }
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .ilike('title', `%${val}%`);
    if (error) {
      console.error(error);
      return;
    }
    const topThree = data.slice(0, 3);
    setSearchResults(topThree);
  }

  function handleSongSelect(song) {
    if (onSongSelect) {
      onSongSelect(song); // Inform parent
    }
    setSearch('');
    setSearchResults([]);
  }
  useState(()=>{
    function getPermisson(){
      const value = sessionStorage.getItem("userInfo");
      if(value && JSON.parse(value).role =='admin' ){
            Set_admin_user(true);
      }
      else Set_admin_user(false);
    }
    getPermisson();
  },[]);

  return (
    <nav className="text-white bg-[#222] p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-extrabold flex items-center gap-2">
          <FaHeadphones className="text-emerald-500 text-3xl" />
          <Link to="/dashboard" className="hover:text-emerald-500 text-lg font-extrabold">
            Tragoudi
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-emerald-500"
            onClick={toggleMenu}
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="space-x-6 hidden md:flex text-lg">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-emerald-500 font-bold">
            <FaHome className="text-xl" /> Home
          </Link>
          <Link to="/fav" className="flex items-center gap-2 hover:text-emerald-500 font-bold">
            <FaHeart className="text-xl" /> Favorites
          </Link>
          <Link to="/account" className="flex items-center gap-2 hover:text-emerald-500 font-bold">
            <FaUser className="text-xl" /> Account
          </Link>
          { admin_user && 
           <Link to="/upload" className="flex items-center gap-2 hover:text-emerald-500 font-bold">
           <IoMdCloudUpload className='text-xl' /> Upload
         </Link>
            }

          {/* Search Bar */}
          <div className="relative flex flex-col items-center">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-3 text-emerald-500" />
              <input
                type="text"
                className={`pl-10 py-2 bg-black/50 text-white rounded-lg transition-all duration-300 ease-in-out ${
                  isSearchFocused ? 'w-60' : 'w-40'
                } focus:outline-none`}
                placeholder="Search"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={search}
                onChange={handleChange}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-60 bg-[#333] rounded-lg shadow-lg overflow-hidden z-50">
                {searchResults.map((song, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-emerald-600 cursor-pointer text-sm"
                    onMouseDown={() => handleSongSelect(song)} // Important! use onMouseDown
                  >
                    {song.title}
                  </div>
                ))}
              </div>
            )}
          </div>
         
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden p-4`}>
        <Link to="/" className="flex items-center gap-2 hover:text-emerald-500 py-2">
          <FaHome className="hover:text-emerald-500 text-xl" /> Home
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 hover:text-emerald-500 py-2">
          <FaHeart className="hover:text-emerald-500 text-xl" /> Favorites
        </Link>
        <Link to="/account" className="flex items-center gap-2 hover:text-emerald-500 py-2">
          <FaUser className="hover:text-emerald-500 text-xl" /> Account
        </Link>
        { admin_user && 
           <Link to="/upload" className="flex items-center gap-2 hover:text-emerald-500 py-2">
            <IoMdCloudUpload className=' text-e  text-xl hover:text-emerald-500' /> Upload
         </Link>
            }

        {/* Mobile Search */}
        <div className="relative flex flex-col items-center mt-4">
          <div className="relative flex items-center w-full">
            <FaSearch className="absolute left-3 text-emerald-500" />
            <input
              type="text"
              className={`pl-10 py-2 bg-black/50 text-white rounded-lg transition-all duration-300 ease-in-out ${
                isSearchFocused ? 'w-full' : 'w-40'
              } focus:outline-none`}
              placeholder="Search"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={search}
              onChange={handleChange}
            />
          </div>

          {/* Mobile Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[#333] rounded-lg shadow-lg overflow-hidden z-50">
              {searchResults.map((song, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-emerald-600 cursor-pointer active:bg-emerald-600 focus:bg-emerald-600 text-sm"
                  onMouseDown={() => handleSongSelect(song)}
                >
                  {song.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
