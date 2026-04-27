import React, { useState, useEffect } from 'react';
import { getTrending, getHomeSuggestions } from '../services/musicService';
import { getRecentSearchTerms } from '../services/searchHistory';
import { useAudio } from '../context/AudioContext';
import SongCard from './SongCard';
import TrackRow from './TrackRow';
import { Play, Heart, MoreVertical } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredSong, setFeaturedSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useAudio();

  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      
      const searchTerms = getRecentSearchTerms(4);
      const allTrending = await getTrending();
      
      const newCategories = [];
      
      if (searchTerms && searchTerms.length > 0) {
        const dynamicCats = await getHomeSuggestions(searchTerms);
        if (dynamicCats) {
          newCategories.push(...dynamicCats);
        }
      }
      
      if (allTrending && allTrending.length > 0) {
        setFeaturedSong(allTrending[0]);
        newCategories.push({ id: 'trending-1', title: 'Personalized Mixes', tracks: allTrending.slice(1, 5) });
        
        if (newCategories.length < 3) {
          newCategories.push({ id: 'trending-2', title: 'New Releases', tracks: allTrending.slice(5, 11) });
        }
        if (newCategories.length < 4) {
          newCategories.push({ id: 'trending-3', title: 'Trending Tracks', tracks: allTrending.slice(11, 16) });
        }
      }
      
      const validCategories = newCategories.filter(c => c && c.tracks && c.tracks.length > 0);
      setCategories(validCategories);
      setIsLoading(false);
    };

    fetchMusic();
  }, []);

  return (
    <div className="home-view animate-fade-in">


      {isLoading ? (
        <div className="loading-state">Loading your music...</div>
      ) : (
        <div className="home-content-sections">
          {featuredSong && (
            <section className="hero-section">
              <div className="hero-card group" onClick={() => playTrack(featuredSong, [featuredSong])}>
                <img className="hero-bg" src={featuredSong.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop'} alt="Featured" />
                <div className="hero-overlay"></div>
                <div className="hero-content">
                  <span className="hero-badge">Featured Track</span>
                  <h2 className="hero-title">{featuredSong.title}</h2>
                  <p className="hero-desc">{featuredSong.artist}</p>
                  <button className="hero-play-btn neon-glow">
                    <Play size={20} fill="currentColor" /> Listen Now
                  </button>
                </div>
              </div>
            </section>
          )}

          {categories[0] && (
            <section className="home-section">
              <div className="section-header-flex">
                <h3 className="section-title">{categories[0].title}</h3>
                <span className="see-all-link">See All</span>
              </div>
              <div className="mixes-grid">
                {categories[0].tracks.map(song => (
                  <div key={song.id} className="mix-card glass-card group" onClick={() => playTrack(song, categories[0].tracks)}>
                    <div className="mix-image-container">
                      <img src={song.thumbnail} alt={song.title} />
                      <div className="mix-play-overlay">
                        <Play size={36} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="mix-info">
                      <p className="mix-title">{song.title}</p>
                      <p className="mix-desc">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {categories[1] && (
            <section className="home-section">
              <h3 className="section-title">{categories[1].title}</h3>
              <div className="releases-scroll">
                {categories[1].tracks.map(song => (
                  <div key={song.id} className="release-card group" onClick={() => playTrack(song, categories[1].tracks)}>
                    <div className="release-image-container border-glow">
                      <img src={song.thumbnail} alt={song.title} />
                    </div>
                    <div className="release-info">
                      <h4 className="release-title">{song.title}</h4>
                      <p className="release-artist">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {categories[2] && (
            <section className="home-section">
              <h3 className="section-title">{categories[2].title}</h3>
              <div className="trending-list">
                {categories[2].tracks.map((song, index) => (
                  <TrackRow 
                    key={song.id} 
                    track={song} 
                    index={index} 
                    queueContext={categories[2].tracks} 
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
