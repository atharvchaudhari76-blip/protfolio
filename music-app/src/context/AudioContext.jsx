import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStreamUrl } from '../services/musicService';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('music-library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('music-library', JSON.stringify(library));
  }, [library]);

  const playTrack = async (track) => {
    setIsLoadingStream(true);
    setCurrentTrack(track);
    try {
      const url = await getStreamUrl(track.id);
      setStreamUrl(url);
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to get stream url:', err);
      // Fallback or error state could be handled here
    } finally {
      setIsLoadingStream(false);
    }
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
    streamUrl,
    isPlaying,
    isLoadingStream,
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
