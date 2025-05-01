import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlayCircle,
  FaPauseCircle,
  FaStepBackward,
  FaStepForward,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

const Controller = ({ songs }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatPlaylist, setRepeatPlaylist] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const progressRef = useRef();
  const audioRef = useRef(null);

  const currentSong = songs[currentSongIndex];

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      if (progressRef.current) {
        progressRef.current.value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      }
    }
  };

  const handleProgressChange = (e) => {
    if (audioRef.current) {
      const newTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      console.log(`Seeked to: ${formatTime(newTime)}`);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      console.log('Paused audio.');
    } else {
      audioRef.current.play();
      console.log('Started playing audio.');
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
  };

  const handleNext = () => {
    const nextIndex =  (currentSongIndex + 1 + songs.length) % songs.length;
    setCurrentSongIndex(nextIndex);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const toggleRepeatPlaylist = () => {
    setRepeatPlaylist(!repeatPlaylist);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  useEffect(() => {
    if (!songs.length) return;

    const newAudio = new Audio(currentSong?.audio_url);
    console.log(`Loading song: ${currentSong?.title}`);

    audioRef.current = newAudio;

    newAudio.addEventListener('timeupdate', updateTime);

    newAudio.addEventListener('ended', () => {
      if (isRepeating) {
        newAudio.currentTime = 0;
        newAudio.play();
      } else if (repeatPlaylist || currentSongIndex < songs.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    });

    newAudio.play()
      .then(() => {
        setIsPlaying(true);
        console.log("Auto-started playback.");
      })
      .catch((err) => {
        console.error("Auto-play failed:", err);
      });

    return () => {
      console.log('Cleaning up old audio...');
      newAudio.pause();
      newAudio.removeEventListener('timeupdate', updateTime);
    };
  }, [currentSongIndex, isRepeating, repeatPlaylist, songs]);

  if (!songs.length) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 text-white z-50 bg-[#222] shadow-2xl flex justify-center items-center">
        <p className="text-gray-400">No songs available</p>
      </div>
    );
  }

  
    return (
      <div className={`fixed bottom-0 bg-[#222] w-full transition-all duration-500 ${showInfo ? 'h-80 md:h-[300px]' : 'h-[103px]'} z-9999`}>
      
      {showInfo && (
  <div className="absolute top-5 left-0 right-0 w-full h-auto  flex  flex-row items-center gap-4 px-4">
    <div className="flex-shrink-0">
      <img src={currentSong?.image_url} alt="" className="h-40 w-40 object-cover rounded-lg shadow-md" />
    </div>
    <div className="text-white w-full overflow-y-auto max-h-[200px]">
      <p><strong>Song Name:</strong> {currentSong.title}</p>
      <p><strong>Movie:</strong> {currentSong.movie}</p>
      <p><strong>Year:</strong> {currentSong.year}</p>
      <p><strong>Artist:</strong> {currentSong.artist}</p>
      <p><strong>Genre:</strong> {currentSong.genre}</p>
      <p><strong>Language:</strong> {currentSong.language}</p>
    </div>
  </div>
)}

  
  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-40 bg-[#222] shadow-2xl flex">
      {/* Seek Bar */}
      <div className="flex flex-col w-[90%]">
        <div className="flex justify-center items-center">
          <input
            ref={progressRef}
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleProgressChange}
            className="md:w-100 w-full h-1 mb-3 bg-gray-600 rounded-lg appearance-none hover:h-2 transition-all"
          />
        </div>

        <div className="flex justify-between items-center">
          {/* Controls */}
          <div className="flex-1 flex justify-center items-center space-x-6">
            <FaRedo
              title="Repeat Playlist"
              className={`text-2xl rotate-90 cursor-pointer transform hover:scale-110 ${
                repeatPlaylist ? 'text-sky-400' : 'text-gray-500'
              }`}
              onClick={toggleRepeatPlaylist}
            />
            <FaStepBackward
              className="text-2xl hover:text-emerald-500 cursor-pointer transform hover:scale-110"
              onClick={handlePrev}
            />
            <div
              className="text-5xl hover:text-emerald-500 cursor-pointer transform hover:scale-110"
              onClick={handlePlayPause}
            >
              {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
            </div>
            <FaStepForward
              className="text-2xl hover:text-emerald-500 cursor-pointer transform hover:scale-110"
              onClick={handleNext}
            />
            <FaRedo
              title="Loop Current"
              className={`text-2xl cursor-pointer transform hover:scale-110 ${
                isRepeating ? 'text-emerald-500' : 'text-gray-500'
              }`}
              onClick={toggleRepeat}
            />
            <div
              className="text-3xl cursor-pointer transform hover:scale-110"
              onClick={toggleMute}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </div>
          </div>
        </div>
      </div>

      {/* Current Song Info */}
      <div className="flex items-center space-x-3 max-w-xs overflow-hidden ml-6">
        <img
          src={currentSong?.image_url}
          alt={currentSong?.title}
          className="w-15 h-15 object-cover rounded-lg shadow-lg cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        />
        <div className="hidden sm:block">
          <p className="font-semibold truncate w-40">{currentSong?.title}</p>
          <p className="text-gray-400 text-sm truncate w-40">{currentSong?.artist}</p>
        </div>
      </div>
    </div>
      </div>
    );
  };
  


export default Controller;
