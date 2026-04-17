import React, { useState } from 'react';
import { Plus, Play, MoreHorizontal, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const Library = () => {
  const { library, playlists, createPlaylist, playTrack, addToPlaylist, removeFromLibrary, addToLibrary } = useAudio();
  const [activeMenuTrackId, setActiveMenuTrackId] = useState(null);

  const handleCreatePlaylist = () => {
    const name = window.prompt("Enter playlist name:", "My Playlist #" + (playlists.length + 1));
    if (name) {
      createPlaylist(name);
    }
  };

  const handlePlayPlaylist = (tracks) => {
    if (tracks && tracks.length > 0) {
      playTrack(tracks[0], tracks);
    } else {
      alert('This playlist is empty.');
    }
  };

  const handleToggleMenu = (e, trackId) => {
    e.stopPropagation();
    setActiveMenuTrackId(prev => prev === trackId ? null : trackId);
  };

  const handleAddToPlaylist = (e, playlistId, track) => {
    e.stopPropagation();
    addToPlaylist(playlistId, track);
    setActiveMenuTrackId(null);
  };

  const handleNewPlaylist = (e, track) => {
    e.stopPropagation();
    const name = window.prompt("Playlist name:");
    if (name) {
      const newPlaylist = createPlaylist(name);
      addToPlaylist(newPlaylist.id, track);
    }
    setActiveMenuTrackId(null);
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
          {playlists.length === 0 ? (
            <p style={{ color: 'var(--text-subdued)' }}>You don't have any playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <div key={playlist.id} className="playlist-card library-playlist">
                <div className="playlist-color" style={{ backgroundColor: 'var(--bg-highlight)' }}></div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.tracks.length} tracks</p>
                </div>
                <button 
                  className="btn" 
                  style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--accent-primary)', borderRadius: '50%', color: '#000', opacity: playlist.tracks.length > 0 ? 1 : 0.5, padding: '12px' }}
                  onClick={() => handlePlayPlaylist(playlist.tracks)}
                >
                  <Play size={24} className="playlist-play" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="liked-songs">
        <h2>Liked Songs</h2>
        <div className="tracks-grid">
          {library.length === 0 ? (
            <p style={{ color: 'var(--text-subdued)' }}>No liked songs yet. Tap the heart on a song to add it here!</p>
          ) : (
            library.map((track) => (
              <div 
                key={track.id} 
                className="track-item" 
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => playTrack(track, library)}
              >
                <div className="track-play">
                  <Play size={20} />
                </div>
                <div className="track-info">
                  <p className="track-title">{track.title}</p>
                  <p className="track-artist">{track.artist}</p>
                </div>
                
                <div className="track-actions-wrapper">
                  <span className="track-duration">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  
                  <button 
                    className="icon-btn track-menu-btn"
                    onClick={(e) => handleToggleMenu(e, track.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {activeMenuTrackId === track.id && (
                    <div className="playlist-dropdown track-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="dropdown-header">Add to playlist</div>
                      <div className="dropdown-content">
                        <button className="dropdown-item create" onClick={(e) => handleNewPlaylist(e, track)}>
                          <Plus size={14} /> New Playlist
                        </button>
                        {playlists.map(p => (
                          <button key={p.id} className="dropdown-item" onClick={(e) => handleAddToPlaylist(e, p.id, track)}>
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Library;
