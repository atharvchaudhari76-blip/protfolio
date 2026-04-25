import React, { useState } from 'react';
import { Plus, Play, MoreHorizontal, Heart, Music2, Clock } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const Library = ({ setView }) => {
  const { library, playlists, createPlaylist, playTrack, addToPlaylist } = useAudio();
  const [activeMenuTrackId, setActiveMenuTrackId] = useState(null);

  const handleCreatePlaylist = () => {
    const name = window.prompt("Enter playlist name:", "My Playlist #" + (playlists.length + 1));
    if (name) {
      createPlaylist(name);
    }
  };

  const handlePlayPlaylist = (e, tracks) => {
    e.stopPropagation();
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
    <div className="library-view animate-fade-in">
      <header className="view-header">
        <h1 className="view-title">Your Library</h1>
        <div className="view-actions">
          <button className="create-btn" onClick={handleCreatePlaylist}>
            <Plus size={20} />
            <span>Create Playlist</span>
          </button>
        </div>
      </header>

      <div className="library-content-grid">
        {/* Featured Card: Liked Songs */}
        <div className="featured-card liked-songs-card" onClick={() => library.length > 0 && playTrack(library[0], library)}>
          <div className="liked-songs-bg">
            <Heart size={48} fill="white" className="heart-icon" />
          </div>
          <div className="card-details">
            <h2>Liked Songs</h2>
            <p className="track-count">{library.length} tracks</p>
          </div>
          {library.length > 0 && (
            <button 
              className="floating-play-btn" 
              onClick={(e) => handlePlayPlaylist(e, library)}
            >
              <Play size={24} fill="black" />
            </button>
          )}
        </div>

        {/* Playlist Cards */}
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card library-playlist">
            <div className="playlist-artwork">
              {playlist.tracks.length > 0 ? (
                <img src={playlist.tracks[0].thumbnail} alt={playlist.name} />
              ) : (
                <div className="placeholder-art">
                  <Music2 size={32} strokeWidth={1} />
                </div>
              )}
              <button 
                className="floating-play-btn" 
                onClick={(e) => handlePlayPlaylist(e, playlist.tracks)}
              >
                <Play size={20} fill="black" />
              </button>
            </div>
            <div className="playlist-info">
              <h3>{playlist.name}</h3>
              <p>{playlist.tracks.length} tracks</p>
            </div>
          </div>
        ))}
      </div>

      <section className="library-tracks-section">
        <div className="section-header">
          <h2>Liked Tracks</h2>
          {library.length > 0 && (
            <div className="list-headers">
              <span className="header-title"># Title</span>
              <span className="header-album">Artist</span>
              <span className="header-duration"><Clock size={16} /></span>
            </div>
          )}
        </div>

        <div className="tracks-list">
          {library.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} className="empty-icon" />
              <p>Songs you like will appear here</p>
              <button className="pill-btn" onClick={() => setView ? setView('home') : null}>Find some songs</button>
            </div>
          ) : (
            library.map((track, index) => (
              <div 
                key={track.id} 
                className="track-row" 
                onClick={() => playTrack(track, library)}
              >
                <div className="track-main">
                  <span className="track-index">{index + 1}</span>
                  <div className="track-thumbnail">
                    <img src={track.thumbnail} alt={track.title} />
                    <Play className="play-icon" size={14} fill="white" />
                  </div>
                  <div className="track-meta">
                    <span className="track-title">{track.title}</span>
                  </div>
                </div>
                
                <span className="track-artist-col">{track.artist}</span>
                
                <div className="track-end">
                  <span className="track-duration">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button 
                    className="track-more-btn"
                    onClick={(e) => handleToggleMenu(e, track.id)}
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeMenuTrackId === track.id && (
                    <div className="track-context-menu" onClick={(e) => e.stopPropagation()}>
                      <div className="menu-header">Add to playlist</div>
                      <div className="menu-items">
                        <button className="menu-item highlight" onClick={(e) => handleNewPlaylist(e, track)}>
                          <Plus size={14} /> New Playlist
                        </button>
                        {playlists.map(p => (
                          <button key={p.id} className="menu-item" onClick={(e) => handleAddToPlaylist(e, p.id, track)}>
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
