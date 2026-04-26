import React, { useState, useRef, useEffect } from 'react';
import { 
  SkipBack, Play, Pause, SkipForward, 
  Shuffle, Repeat, Heart, ChevronDown, 
  Share2, ListMusic, Music
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const NowPlaying = ({ goBack }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    library,
    addToLibrary,
    removeFromLibrary
  } = useAudio();

  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);

  // Listen to the audio element for time updates (shared via the PlayerBar audio element)
  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const onTime = () => setPlayedSeconds(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    // Grab current values immediately
    setPlayedSeconds(audio.currentTime || 0);
    setDuration(audio.duration || 0);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
    };
  }, [currentTrack]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    const audio = document.querySelector('audio');
    if (audio) {
      audio.currentTime = time;
      setPlayedSeconds(time);
    }
  };

  const isLiked = currentTrack ? library.some(t => t.id === currentTrack.id) : false;

  const handleLike = () => {
    if (!currentTrack) return;
    if (isLiked) {
      removeFromLibrary(currentTrack.id);
    } else {
      addToLibrary(currentTrack);
    }
  };

  if (!currentTrack) {
    return (
      <div className="np-view animate-fade-in">
        <div className="np-empty">
          <Music size={64} strokeWidth={1} />
          <h2>Nothing Playing</h2>
          <p>Play a song to see it here</p>
          <button className="np-back-btn" onClick={goBack}>
            <ChevronDown size={20} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = duration > 0 ? (playedSeconds / duration) * 100 : 0;

  return (
    <div className="np-view animate-fade-in">
      {/* Header */}
      <div className="np-header">
        <button className="np-back-btn" onClick={goBack}>
          <ChevronDown size={24} />
        </button>
        <span className="np-header-label">Now Playing</span>
        <button className="np-share-btn">
          <Share2 size={20} />
        </button>
      </div>

      {/* Album Art */}
      <div className="np-art-container">
        <div className={`np-art-wrapper ${isPlaying ? 'playing' : ''}`}>
          <img 
            src={currentTrack.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'} 
            alt={currentTrack.title}
            className="np-art"
          />
          <div className="np-art-glow"></div>
        </div>
      </div>

      {/* Track Info */}
      <div className="np-track-info">
        <h1 className="np-title">{currentTrack.title}</h1>
        <p className="np-artist">{currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="np-progress-section">
        <div className="np-progress-bar">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={playedSeconds}
            onChange={handleSeek}
            className="np-slider"
            style={{ '--np-progress': `${progress}%` }}
          />
          <div className="np-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="np-time-row">
          <span>{formatTime(playedSeconds)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="np-controls">
        <button 
          className={`np-ctrl-btn np-secondary ${isShuffled ? 'active' : ''}`} 
          onClick={toggleShuffle}
        >
          <Shuffle size={22} />
        </button>
        <button className="np-ctrl-btn" onClick={playPrevious}>
          <SkipBack size={28} fill="currentColor" />
        </button>
        <button className="np-play-btn neon-glow" onClick={togglePlay}>
          {isPlaying 
            ? <Pause size={32} fill="currentColor" /> 
            : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
          }
        </button>
        <button className="np-ctrl-btn" onClick={playNext}>
          <SkipForward size={28} fill="currentColor" />
        </button>
        <button 
          className={`np-ctrl-btn np-secondary ${repeatMode !== 'off' ? 'active' : ''}`}
          onClick={toggleRepeat}
        >
          <Repeat size={22} />
          {repeatMode === 'one' && <span className="np-repeat-badge">1</span>}
        </button>
      </div>

      {/* Actions Row */}
      <div className="np-actions-row">
        <button className={`np-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button className="np-action-btn">
          <ListMusic size={22} />
        </button>
      </div>
    </div>
  );
};

export default NowPlaying;
