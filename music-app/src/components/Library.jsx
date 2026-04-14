import React from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Trash2, Library as LibraryIcon } from 'lucide-react';

const Library = () => {
  const { library, playTrack, removeFromLibrary } = useAudio();

  return (
    <div>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '40px', marginBottom: '8px' }}>Your Library</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Your favorite tracks, saved forever.</p>

      {library.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          height: '400px', border: '2px dashed var(--border-glass)', borderRadius: '20px', color: 'var(--text-muted)' 
        }}>
          <LibraryIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p>Your library is empty. Start adding some songs!</p>
        </div>
      ) : (
        <div className="song-grid">
          {library.map((song) => (
            <div key={song.id} className="song-card" onClick={() => playTrack(song)}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={song.thumbnail} 
                  alt={song.title} 
                  style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {song.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{song.artist}</div>
              
              <button 
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromLibrary(song.id);
                }}
                style={{ 
                  marginTop: '12px', width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                  padding: '8px', borderRadius: '6px', fontSize: '12px', gap: '8px' 
                }}
              >
                <Trash2 size={14} />
                Remove from Library
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
