import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2, Play, Plus, Check } from 'lucide-react';
import { searchMusic } from '../services/musicService';
import { useAudio } from '../context/AudioContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { playTrack, addToLibrary, library } = useAudio();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await searchMusic(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Outfit', marginBottom: '8px' }}>Explore</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Search millions of tracks from AesthetiCore.</p>

      <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '600px' }}>
        <input 
          type="text" 
          placeholder="Search for songs, artists, or albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button 
          type="submit" 
          className="btn" 
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <SearchIcon size={20} />}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '24px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="song-grid">
        {results.map((song) => {
          const isLiked = library.find(t => t.id === song.id);
          return (
            <div key={song.id} className="song-card" onClick={() => playTrack(song)}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img 
                  src={song.thumbnail} 
                  alt={song.title} 
                  style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div className="play-overlay" style={{ 
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s', borderRadius: '8px'
                }}>
                  <Play fill="white" size={32} />
                </div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {song.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{song.artist}</div>
              
              <button 
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToLibrary(song);
                }}
                style={{ 
                  marginTop: '12px', width: '100%', background: 'var(--bg-glass)', 
                  padding: '8px', borderRadius: '6px', fontSize: '12px', gap: '8px' 
                }}
              >
                {isLiked ? <Check size={14} /> : <Plus size={14} />}
                {isLiked ? 'In Library' : 'Add to Library'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;
