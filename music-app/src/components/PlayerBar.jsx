import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, Heart, ExternalLink, Loader2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { searchMusic } from '../services/musicService';

const PlayerBar = () => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume, library, addToLibrary, removeFromLibrary } = useAudio();
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const isLiked = currentTrack && library.find(t => t.id === currentTrack.id);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setPlayed(time);
    playerRef.current.seekTo(time);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="player-bar">
      {/* Hidden Player */}
      <div style={{ display: 'none' }}>
        {currentTrack.streamUrl && (
          <ReactPlayer
            ref={playerRef}
            url={currentTrack.streamUrl}
            playing={isPlaying}
            volume={volume}
            onProgress={(p) => setPlayed(p.playedSeconds)}
            onDuration={(d) => setDuration(d)}
            config={{
              file: {
                forceAudio: true,
                attributes: { controlsList: 'nodownload' }
              }
            }}
          />
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '30%', gap: '16px' }}>
        <img 
          src={currentTrack.thumbnail} 
          alt={currentTrack.title} 
          style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentTrack.artist}</div>
        </div>
        <button 
          className="btn" 
          onClick={() => isLiked ? removeFromLibrary(currentTrack.id) : addToLibrary(currentTrack)}
          style={{ color: isLiked ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button className="btn"><SkipBack size={20} /></button>
          <button 
            className="btn" 
            onClick={togglePlay}
            style={{ background: 'white', color: 'black', padding: '10px', borderRadius: '50%' }}
          >
            {isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" style={{ marginLeft: '2px' }} />
            )}
          </button>
          <button className="btn"><SkipForward size={20} /></button>
        </div>

        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '600px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '40px' }}>{formatTime(played)}</span>
          <input 
            type="range" 
            min={0} 
            max={duration} 
            step="any"
            value={played}
            onChange={handleSeek}
            style={{ 
              flex: 1, 
              accentColor: 'var(--accent-primary)',
              height: '4px',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '40px' }}>{formatTime(duration)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'flex-end', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--text-muted)" />
          <input 
            type="range" 
            min={0} 
            max={1} 
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: '80px', accentColor: 'var(--text-main)', height: '4px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
