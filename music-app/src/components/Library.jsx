import React, { useState, useEffect } from 'react';
import { Plus, Play, MoreHorizontal } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { getTrending } from '../services/musicService';

const mockPlaylists = [
  { id: 1, title: 'My Playlist #1', tracks: 12, color: '#1db954' },
  { id: 2, title: 'Workout Beats', tracks: 28, color: '#ff4500' },
  { id: 3, title: 'Chill Vibes', tracks: 45, color: '#1e90ff' },
  { id: 4, title: 'Road Trip', tracks: 19, color: '#ffd700' },
];

const Library = () => {
  const [likedTracks, setLikedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    const fetchLikedTracks = async () => {
      try {
        const trending = await getTrending();
        setLikedTracks(trending.slice(0, 5)); // Just take 5 as mock "Liked" tracks
      } catch (error) {
        console.error('Failed to fetch liked tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedTracks();
  }, []);

  const handleCreatePlaylist = () => {
    alert('Playlist created successfully!');
  };

  const handlePlayPlaylist = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    } else {
      alert('Loading tracks... please wait.');
    }
  };

  return (
    <div className="library">
      <header className="library-header">
        <h1>Your Library</h1>
        <div className="library-actions">
          <button className="btn-secondary" onClick={handleCreatePlaylist}>
            <Plus size={20} />
            Create
          </button>
        </div>
      </header>

      <section className="playlists-section">
        <h2>Playlists</h2>
        <div className="playlists-grid">
          {mockPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-card library-playlist">
              <div className="playlist-color" style={{ backgroundColor: playlist.color }}></div>
              <div className="playlist-info">
                <h3>{playlist.title}</h3>
                <p>{playlist.tracks} tracks</p>
              </div>
              <button 
                className="btn" 
                style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--accent-primary)', borderRadius: '50%', color: '#000', opacity: 0, padding: '12px' }}
                onClick={handlePlayPlaylist}
              >
                <Play size={24} className="playlist-play" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="liked-songs">
        <h2>Liked Songs</h2>
        <div className="tracks-grid">
          {isLoading ? (
            <p>Loading your liked songs...</p>
          ) : (
            likedTracks.map((track) => (
              <div 
                key={track.id} 
                className="track-item" 
                style={{ cursor: 'pointer' }}
                onClick={() => playTrack(track, likedTracks)}
              >
                <div className="track-play">
                  <Play size={20} />
                </div>
                <div className="track-info">
                  <p className="track-title">{track.title}</p>
                  <p className="track-artist">{track.artist}</p>
                </div>
                <span className="track-duration">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
                <MoreHorizontal size={20} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Library;
