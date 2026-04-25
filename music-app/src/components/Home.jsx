import React, { useState, useEffect } from 'react';
import { getTrending, getHomeSuggestions } from '../services/musicService';
import { getRecentSearchTerms } from '../services/searchHistory';
import { useAudio } from '../context/AudioContext';
import SongCard from './SongCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack } = useAudio();
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      
      const searchTerms = getRecentSearchTerms(4);
      const allTrending = await getTrending();
      
      const newCategories = [];
      
      // Generate dynamic categories from search history
      if (searchTerms && searchTerms.length > 0) {
        const dynamicCats = await getHomeSuggestions(searchTerms);
        if (dynamicCats) {
          newCategories.push(...dynamicCats);
        }
      }
      
      // Fallback categories from trending data
      if (allTrending && allTrending.length > 0) {
        newCategories.push({ id: 'trending-1', title: 'Top Hits', tracks: allTrending.slice(0, 6) });
        
        if (newCategories.length < 3) {
          newCategories.push({ id: 'trending-2', title: 'Trending Now', tracks: allTrending.slice(6, 12) });
        }
        if (newCategories.length < 4) {
          newCategories.push({ id: 'trending-3', title: 'Focus', tracks: allTrending.slice(12, 18) });
        }
      }
      
      // Filter out any invalid/empty categories
      const validCategories = newCategories.filter(c => c && c.tracks && c.tracks.length > 0);
      setCategories(validCategories);
      setIsLoading(false);
    };

    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };

    fetchMusic();
    updateGreeting();
  }, []);

  return (
    <div className="home-view animate-fade-in">
      <header className="view-header">
         <h1 className="view-title">{greeting}</h1>
      </header>

      {isLoading ? (
        <div className="loading-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subdued)' }}>
          Loading your music...
        </div>
      ) : (
        <div className="home-categories">
          {categories.map((category, idx) => (
            <section key={category.id || idx} className="home-section">
              <h2 className="section-title">{category.title}</h2>
              <div className="song-grid">
                {category.tracks.map(song => (
                  <SongCard 
                    key={song.id} 
                    song={song} 
                    onClick={() => playTrack(song, category.tracks)} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
