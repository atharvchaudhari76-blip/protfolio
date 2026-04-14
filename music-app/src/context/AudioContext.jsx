import React, { createContext, useContext, useState, useEffect } from 'react';
import { searchMusic } from '../services/musicService';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('music-library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('music-library', JSON.stringify(library));
  }, [library]);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const addToLibrary = (track) => {
    if (!library.find(t => t.id === track.id)) {
      setLibrary([...library, track]);
    }
  };

  const removeFromLibrary = (trackId) => {
    setLibrary(library.filter(t => t.id !== trackId));
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    library,
    playTrack,
    togglePlay,
    setVolume,
    setIsPlaying,
    addToLibrary,
    removeFromLibrary
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

