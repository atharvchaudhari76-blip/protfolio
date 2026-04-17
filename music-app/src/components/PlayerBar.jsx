import React, { useState, useRef, useEffect } from 'react';
import { 
  SkipBack, Play, Pause, SkipForward, Volume2, 
  VolumeX, Shuffle, Repeat, Music, Heart, Mic2, ListMusic, MonitorSpeaker
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const PlayerBar = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    playNext, 
    playPrevious,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    setIsPlaying,
    library,
    addToLibrary,
    removeFromLibrary
  } = useAudio();
  
  const playNextRef = useRef(playNext);
  const playPreviousRef = useRef(playPrevious);
  const togglePlayRef = useRef(togglePlay);

  useEffect(() => {
    playNextRef.current = playNext;
    playPreviousRef.current = playPrevious;
    togglePlayRef.current = togglePlay;
  }, [playNext, playPrevious, togglePlay]);

  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Sync isPlaying state with native audio element
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Playback failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, setIsPlaying]);

  // Configure Media Session API for mobile OS controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      const trackImage = currentTrack.image?.[2]?.link || currentTrack.image?.[1]?.link || currentTrack.image?.[0]?.link || '';
      
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.name,
        artist: currentTrack.artist,
        artwork: [
          { src: trackImage || 'https://via.placeholder.com/96', sizes: '96x96', type: 'image/jpeg' },
          { src: trackImage || 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => togglePlayRef.current());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayRef.current());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousRef.current());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNextRef.current());
    }
  }, [currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlayedSeconds(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlayedSeconds(time);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="player-bar">
      {/* Left Section: Track Info */}
      <div className="player-left">
        <div className="player-art-container">
          {currentTrack.image ? (
            <img src={currentTrack.image[1]?.link || currentTrack.image[0]?.link} alt={currentTrack.name} className="now-playing-art" />
          ) : (
            <div className="art-placeholder"><Music size={20} /></div>
          )}
        </div>
        <div className="track-info">
          <h4 className="player-track-title">{currentTrack.name}</h4>
          <p className="player-track-artist">{currentTrack.artist}</p>
        </div>
        <button 
          className="icon-btn heart-btn"
          onClick={() => {
            if (library.find(t => t.id === currentTrack.id)) {
              removeFromLibrary(currentTrack.id);
            } else {
              addToLibrary(currentTrack);
            }
          }}
        >
          <Heart 
            size={18} 
            fill={library.find(t => t.id === currentTrack.id) ? "var(--accent-primary)" : "none"} 
            color={library.find(t => t.id === currentTrack.id) ? "var(--accent-primary)" : "currentColor"}
          />
        </button>
      </div>

      {/* Middle Section: Controls & Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button 
            className={`control-btn ${isShuffled ? 'active' : ''}`} 
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>
          <button 
            className="control-btn" 
            onClick={() => {
              console.log('PlayerBar: Previous button clicked');
              playPrevious();
            }} 
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="play-btn-circle" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
          </button>
          <button 
            className="control-btn" 
            onClick={() => {
              console.log('PlayerBar: Next button clicked');
              playNext();
            }} 
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button 
            className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={toggleRepeat}
            title="Repeat"
          >
            <Repeat size={16} />
            {repeatMode === 'one' && <span className="repeat-badge">1</span>}
          </button>
        </div>
        
        <div className="playback-bar">
          <span className="time-text">{formatTime(playedSeconds)}</span>
          <div className="progress-bar-container">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={playedSeconds}
              onChange={handleSeek}
              className="player-slider"
              style={{ '--progress': `${(playedSeconds / (duration || 1)) * 100}%` }}
            />
            <div 
              className="player-progress-fill" 
              style={{ width: `${(playedSeconds / (duration || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="time-text">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Section: Utilities */}
      <div className="player-right">
        <button className="utility-btn"><Mic2 size={16} /></button>
        <button className="utility-btn"><ListMusic size={16} /></button>
        <button className="utility-btn"><MonitorSpeaker size={16} /></button>
        <div className="volume-wrapper">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <div className="progress-bar-container volume-bar">
             <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="player-slider"
                style={{ '--progress': `${volume * 100}%` }}
              />
              <div 
                className="player-progress-fill" 
                style={{ width: `${volume * 100}%` }}
              ></div>
          </div>
        </div>
      </div>

      {/* Standard Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
        hidden
      />
    </div>
  );
};

export default PlayerBar;
