import React, { useEffect, useState } from 'react';
import { getTrending } from '../services/musicService';
import { useAudio } from '../context/AudioContext';
import { Play, TrendingUp, Clock } from 'lucide-react';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const { playTrack, library } = useAudio();

  useEffect(() => {
    getTrending().then(setTrending);
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '40px', marginBottom: '8px' }}>Welcome back</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Discover trending music from across the globe.</p>

      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <TrendingUp size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '20px' }}>Trending Now</h2>
        </div>
        <div className="song-grid">
          {trending.map(song => (
            <div key={song.id} className="song-card" onClick={() => playTrack(song)}>
              <img src={song.thumbnail} alt="" style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover', marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{song.artist}</div>
            </div>
          ))}
        </div>
      </section>

      {library.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Clock size={20} color="var(--accent-secondary)" />
            <h2 style={{ fontSize: '20px' }}>Quick Play (Library)</h2>
          </div>
          <div className="song-grid">
            {library.slice(0, 5).map(song => (
              <div key={song.id} className="song-card" onClick={() => playTrack(song)}>
                <img src={song.thumbnail} alt="" style={{ width: '100%', aspectRatio: '1', borderRadius: '8px', objectFit: 'cover', marginBottom: '12px' }} />
                <div style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{song.artist}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
