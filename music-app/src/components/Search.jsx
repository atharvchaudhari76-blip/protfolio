import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Music, Play } from 'lucide-react';
import { searchMusic } from '../services/musicService';
import { useAudio } from '../context/AudioContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playTrack, currentTrack, isPlaying } = useAudio();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const songs = await searchMusic(query);
          setResults(songs);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handlePlay = (song) => {
    playTrack(song, results);
  };

  return (
    <div className="search">
      <div className="search-header">
        <div className="search-bar">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : query ? (
        <div className="search-results">
          {results.length > 0 ? (
            <>
              <section className="songs-results">
                <h3>Songs</h3>
                <div className="tracks-grid">
                  {results.map((song) => (
                    <div 
                      key={song.id} 
                      className={`track-item ${currentTrack?.id === song.id ? 'active' : ''}`}
                      onClick={() => handlePlay(song)}
                    >
                      <div className="track-play">
                        {currentTrack?.id === song.id && isPlaying ? (
                          <div className="playing-animation">
                            <span></span><span></span><span></span>
                          </div>
                        ) : (
                          <Play size={20} fill="#fff" />
                        )}
                      </div>
                      <div className="track-info">
                        <p className="track-title">{song.title}</p>
                        <p className="track-artist">{song.artist}</p>
                      </div>
                      <span className="track-duration">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="search-empty">
              <SearchIcon size={64} />
              <h3>No results found for "{query}"</h3>
              <p>Try searching for something else</p>
            </div>
          )}
        </div>
      ) : (
        <div className="search-empty">
          <SearchIcon size={64} />
          <h3>Start typing to search</h3>
          <p>Songs, artists, podcasts and more</p>
        </div>
      )}
    </div>
  );
};

export default Search;

