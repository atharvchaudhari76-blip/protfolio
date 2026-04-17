import React, { useState, useEffect } from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { getTrending, searchMusic } from '../services/musicService';
import { useAudio } from '../context/AudioContext';
import SongCard from './SongCard';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [categories, setCategories] = useState([]);
  const { playTrack } = useAudio();

  useEffect(() => {
    const fetchMusic = async () => {
      const allSongs = await getTrending();
      setSongs(allSongs);
      
      // Create some mock categories
      setCategories([
        { id: '1', title: 'Top Hits', tracks: allSongs.slice(0, 6) },
        { id: '2', title: 'Recently Played', tracks: allSongs.slice(2, 8) },
        { id: '3', title: 'Made For You', tracks: allSongs.slice(4, 10) }
      ]);
    };
    fetchMusic();
  }, []);

  return (
    <div className="home-content">
      <div className="home-categories">
        {categories.map(category => (
          <section key={category.id} className="home-section">
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
    </div>
  );
};

export default Home;
