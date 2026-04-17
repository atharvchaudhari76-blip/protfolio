import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { searchMusic } from '../services/musicService';
import { useAudio } from '../context/AudioContext';
import SongCard from './SongCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playTrack } = useAudio();

  const browseCategories = [
    { title: 'Music', color: '#E13300' },
    { title: 'Podcasts', color: '#27856A' },
    { title: 'Live Events', color: '#1E3264' },
    { title: 'Made For You', color: '#8D67AB' },
    { title: 'New Releases', color: '#7358FF' },
    { title: 'Hip-Hop', color: '#BA5D07' },
    { title: 'Pop', color: '#148A08' },
    { title: 'Mood', color: '#D84000' },
  ];

  useEffect(() => {
    const handleSearch = async () => {
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
    };

    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-input-wrapper">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="search-content">
        {query ? (
          isLoading ? (
            <div className="loading-state">Searching...</div>
          ) : results.length > 0 ? (
            <div className="search-results">
              <h2 className="section-title">Songs</h2>
              <div className="song-grid">
                {results.map((song) => (
                  <SongCard 
                    key={song.id} 
                    song={song} 
                    onClick={() => playTrack(song, results)} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h2>No results found for "{query}"</h2>
              <p>Please make sure your words are spelled correctly or use fewer or different keywords.</p>
            </div>
          )
        ) : (
          <div className="browse-section">
            <h2 className="section-title">Browse all</h2>
            <div className="browse-grid">
              {browseCategories.map((cat, index) => (
                <div 
                  key={index} 
                  className="browse-card" 
                  style={{ backgroundColor: cat.color }}
                  onClick={() => setQuery(cat.title)}
                >
                  <h3>{cat.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

