import React, { useState, useEffect } from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { getTrending } from '../services/musicService';
import { useAudio } from '../context/AudioContext';

const Home = () => {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useAudio();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const tracks = await getTrending();
        setTrendingTracks(tracks);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handlePlay = (track) => {
    playTrack(track, trendingTracks);
  };

  return (
    <div className="home">
      <section className="hero">
        <h2>Good evening</h2>
        <p className="section-subtitle">Trending and top hits for you</p>
      </section>

      <section className="recently-played">
        <h3>Trending Tracks</h3>
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading trending tracks...</p>
          </div>
        ) : (
          <div className="tracks-grid">
            {trendingTracks.map((track) => (
              <div 
                key={track.id} 
                className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                onClick={() => handlePlay(track)}
              >
                <div className="track-play">
                  {currentTrack?.id === track.id && isPlaying ? (
                    <div className="playing-animation pink">
                       <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <Play size={20} fill="#fff" />
                  )}
                </div>
                <div className="track-info">
                  <p className="track-title">{track.title}</p>
                  <p className="track-artist">{track.artist}</p>
                </div>
                <span className="track-duration">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
                <MoreHorizontal size={20} className="track-more" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

