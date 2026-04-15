import React, { useState, useRef, useEffect } from 'react';
import { 
  SkipBack, Play, Pause, SkipForward, Volume2, Maximize2, 
  VolumeX, Shuffle, Repeat, Music 
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
    setIsPlaying
  } = useAudio();

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
      <div className="player-left">
        <div className="player-art-container">
          {currentTrack.thumbnail ? (
            <img src={currentTrack.thumbnail} alt={currentTrack.title} className="now-playing-art" />
          ) : (
            <div className="art-placeholder"><Music size={20} /></div>
          )}
        </div>
        <div className="track-info">
          <h4>{currentTrack.title}</h4>
          <p>{currentTrack.artist}</p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button 
            className={`control-btn ${isShuffled ? 'active' : ''}`} 
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>
          <button className="control-btn" onClick={playPrevious} title="Previous">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="play-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="control-btn" onClick={playNext} title="Next">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button 
            className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={toggleRepeat}
            title="Repeat"
          >
            <Repeat size={18} />
            {repeatMode === 'one' && <span className="repeat-badge">1</span>}
          </button>
        </div>
        
        <div className="progress-container">
          <span className="time current">{formatTime(playedSeconds)}</span>
          <div className="progress-bar-wrapper">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={playedSeconds}
              onChange={handleSeek}
              className="main-progress-bar"
            />
            <div 
              className="progress-fill" 
              style={{ width: `${(playedSeconds / (duration || 1)) * 100}%` }}
            ></div>
          </div>
          <span className="time total">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <div className="volume-control">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
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
