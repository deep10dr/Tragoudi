import React, { useState, useEffect ,useRef} from 'react';
import Navbar from '../components/Navbar';
import Controller from '../components/Controller';
import { supabase } from '../lib/supabaseClient';
import PlayOverlay from '../components/PlayOverlay';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // or any icons you use

const genreList = [
  { name: 'Love', img: '/images/love.jpg' },
  { name: 'Sad', img: '/images/sad.jpg' },
  { name: 'Romantic', img: '/images/romantic.jpg' },
  { name: 'Melody', img: '/images/melody.jpg' },
  { name: 'Dance', img: '/images/dance.jpg' },
  { name: 'Mass', img: '/images/mass.jpg' },
  { name: 'Kuthu', img: '/images/kuthu.jpg' },
  { name: 'Friendship', img: '/images/friendship.jpg' },
  { name: 'Motivational', img: '/images/motivational.jpg' },
  { name: 'Devotional', img: '/images/devotional.jpg' },
  { name: 'Lofi', img: '/images/lofi.jpg' },
  { name: 'Folk', img: '/images/folk.jpg' },
  { name: 'Instrumental', img: '/images/instrument.jpg' },
  { name: 'Other', img: '/images/others.jpg' },
];

const languageList = [
  { name: 'Tamil', img: '/images/tamil.jpg' },
  { name: 'English', img: '/images/english.jpg' },
  { name: 'Malayalam', img: '/images/malayalam.jpg' },
  { name: 'Hindi', img: '/images/hindi.jpg' },
  { name: 'Telugu', img: '/images/telugu.jpg' },
  { name: 'Other', img: '/images/album.jpg' },
];

const yearList = [
  { name: 'Current Year', img: '/images/current.jpg' },
  { name: '2020 - 2010', img: '/images/2010.jpg' },
  { name: '2010 - 2000', img: '/images/2000.jpg' },
  { name: '2000 - 1990', img: '/images/90.jpg' },
];

export default function Dashboard() {
  const [hovered, setHovered] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [currentSongsList, setCurrentSongsList] = useState([]);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // useEffect(() => {
  //   const fetchSongs = async () => {
  //     const { data, error } = await  supabase.from('songs').select('*');
  //     if (error) {
  //       console.error('Error fetching songs:', error);
  //       return;
  //     }
  //     setSongs(data);
    
  //     if (data.length > 0) {
  //       setCurrentSongsList(data);
  //       setCurrentSong(data[0]);
  //       setCurrentSongIndex(0);
  //       setIsPlaying(false);
  //     }
  //   };
  //   fetchSongs();
  // }, []);

    useEffect(() => {
      checkScroll(); // check initially if needed
    }, []);

  async function handlechange(type, value) {
    let query = supabase.from('songs').select('*');
  
    if (type === 'year') {
      if (value === 'Current Year') {
        const currentYear = new Date().getFullYear();
        query = query.gte('year', currentYear - 1);
      } else if (value === '2020 - 2010') {
        query = query.gte('year', 2010).lte('year', 2020);
      } else if (value === '2010 - 2000') {
        query = query.gte('year', 2000).lt('year', 2010);
      } else if (value === '2000 - 1990') {
        query = query.gte('year', 1990).lt('year', 2000);
      } else {
        console.warn('Unknown year range:', value);
        return;
      }
    } else {
      query = query.eq(type, value);
    }
  
    const { data, error } = await query;  // only await after building query
  
    if (error) {
      console.error('Error fetching songs:', error);
      return;
    }
  
    if (data.length > 0) {
      setSongs(data);
      setCurrentSongsList(data);
      setCurrentSong(data[0]);
      setCurrentSongIndex(0);
      setIsPlaying(true); // Auto-play first song
    } else {
      console.log('No songs found for', value);
    }
  setSongs(data);
  }

  function handlechange1(e){
    const a = [];
    a.push(e);
    console.log(a.length);
    if (a.length > 0) {
      setSongs(a);
      setCurrentSongsList(a);
      setCurrentSong(a[0]);
      setCurrentSongIndex(0);
      setIsPlaying(true); // Auto-play first song
    } else {
      console.log('No songs found for in handel', a);
    }
  }
 

  
    function checkScroll() {
      const el = scrollRef.current;
      if (!el) return;
  
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  
    function handleScroll(direction) {
      const el = scrollRef.current;
      if (!el) return;
  
      const scrollAmount = 200; // adjust how much to scroll
  
      if (direction === 'left') {
        el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  
  

  const handleMouseEnter = (id) => setHovered(id);
  const handleMouseLeave = () => setHovered(null);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handlePrev = () => {
    if (!currentSongsList.length) return;
    const prevIndex = (currentSongIndex - 1 + currentSongsList.length) % currentSongsList.length;
    setCurrentSong(currentSongsList[prevIndex]);
    setCurrentSongIndex(prevIndex);
  };

  const handleNext = () => {
    if (!currentSongsList.length) return;
    const nextIndex = (currentSongIndex + 1) % currentSongsList.length;
    setCurrentSong(currentSongsList[nextIndex]);
    setCurrentSongIndex(nextIndex);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      <Navbar onSongSelect = {handlechange1} />

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-10 pb-24">
        
        {/* Languages Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Languages</h2>
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {languageList.map((lang, idx) => (
              <div
                key={idx}
                className="relative min-w-[150px] rounded-lg overflow-hidden group h-36 cursor-pointer bg-gray-800"
                onMouseEnter={() => handleMouseEnter(`language-${idx}`)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handlechange('language', lang.name)}
              >
                <img src={lang.img} alt={lang.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <PlayOverlay isVisible={hovered === `language-${idx}`} />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-2 text-center">
                  <p className="text-sm font-medium">{lang.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Release Years Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Release Years</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {yearList.map((year, idx) => (
              <div
                key={idx}
                className="relative min-w-[150px] rounded-lg overflow-hidden group h-36 cursor-pointer bg-gray-700"
                onMouseEnter={() => handleMouseEnter(`year-${idx}`)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handlechange('year', year.name)}
              >
                <img src={year.img} alt={year.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <PlayOverlay isVisible={hovered === `year-${idx}`} />
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-2 text-center">
                  <p className="text-sm font-medium">{year.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

    {/* Genres Section */}
<section className="relative">
  <h2 className="text-2xl font-bold mb-4">Genres</h2>

  {/* Left Scroll Button */}
  {showLeft && (
    <button 
      onClick={() => handleScroll('left')}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10"
    >
      <ChevronLeft size={24} />
    </button>
  )}

  {/* Scrollable Div */}
  <div
    className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide"
    style={{
      overflowX: 'auto',
      scrollbarWidth: 'none', // For Firefox
      msOverflowStyle: 'none', // For Internet Explorer
    }}
    ref={scrollRef}
    onScroll={checkScroll}
  >
    {genreList.map((genre, idx) => (
      <div
        key={idx}
        className="relative min-w-[150px] rounded-lg overflow-hidden group h-36 cursor-pointer bg-gray-600"
        onMouseEnter={() => handleMouseEnter(`genre-${idx}`)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handlechange('genre', genre.name)}
      >
        <img src={genre.img} alt={genre.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <PlayOverlay isVisible={hovered === `genre-${idx}`} />
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-2 text-center">
          <p className="text-sm font-medium">{genre.name}</p>
        </div>
      </div>
    ))}
  </div>

  {/* Right Scroll Button */}
  {showRight && (
    <button 
      onClick={() => handleScroll('right')}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full z-10 flex justify-center items-center "
    >
      <ChevronRight size={24} />
    </button>
  )}
</section>


      </div>

      <Controller songs={songs} />

    </div>
  );
}
