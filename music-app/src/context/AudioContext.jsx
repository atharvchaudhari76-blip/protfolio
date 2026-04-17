import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('music-library');
    return saved ? JSON.parse(saved) : [];
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('music-playlists');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('music-library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('music-playlists', JSON.stringify(playlists));
  }, [playlists]);

  const toggleShuffle = () => {
    if (!isShuffled) {
      setOriginalQueue([...queue]);
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      // Ensure current track is still at the right place or handle it
      setQueue(shuffled);
    } else {
      setQueue(originalQueue);
    }
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const playTrack = (track, newQueue = []) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (newQueue.length > 0) {
      setQueue(newQueue);
      setOriginalQueue(newQueue);
      if (isShuffled) {
        const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
      }
    } else if (!queue.find(t => t.id === track.id)) {
      setQueue([track]);
      setOriginalQueue([track]);
    }
  };

  const playNext = () => {
    console.log('AudioContext: playNext called', { queueLength: queue.length, currentTrackId: currentTrack?.id });
    if (!currentTrack || queue.length === 0) return;
    
    if (repeatMode === 'one') {
      const track = currentTrack;
      setCurrentTrack(null);
      setTimeout(() => setCurrentTrack(track), 10);
      return;
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < queue.length) {
      console.log(`AudioContext: skipping to next track at index ${nextIndex}`);
      setCurrentTrack(queue[nextIndex]);
    } else if (repeatMode === 'all') {
      console.log('AudioContext: end of queue reached, looping to start');
      setCurrentTrack(queue[0]);
    } else {
      console.log('AudioContext: end of queue reached, stopping playback');
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    console.log('AudioContext: playPrevious called');
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      console.log(`AudioContext: skipping to previous track at index ${prevIndex}`);
      setCurrentTrack(queue[prevIndex]);
    } else if (repeatMode === 'all') {
      console.log('AudioContext: start of queue reached, looping to end');
      setCurrentTrack(queue[queue.length - 1]);
    } else {
      // If at the beginning, just restart the song
      const track = currentTrack;
      setCurrentTrack(null);
      setTimeout(() => setCurrentTrack(track), 10);
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

  const createPlaylist = (name = "New Playlist") => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date().toISOString()
    };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, track) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId && !p.tracks.find(t => t.id === track.id)) {
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    }));
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    library,
    queue,
    isShuffled,
    repeatMode,
    playlists,
    playTrack,
    playNext,
    playPrevious,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    setIsPlaying,
    addToLibrary,
    removeFromLibrary,
    createPlaylist,
    addToPlaylist
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};



