import React, { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const SongCard = ({ song, onClick }) => {
  const { 
    currentTrack, 
    isPlaying, 
    library, 
    addToLibrary, 
    removeFromLibrary, 
    playlists, 
    addToPlaylist,
    createPlaylist 
  } = useAudio();
  
  const [showPlaylists, setShowPlaylists] = useState(false);
  const isActive = currentTrack?.id === song.id;
  const isLiked = library.find(t => t.id === song.id);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      removeFromLibrary(song.id);
    } else {
      addToLibrary(song);
    }
  };

  const handleAddToPlaylist = (e, playlistId) => {
    e.stopPropagation();
    addToPlaylist(playlistId, song);
    setShowPlaylists(false);
  };

  const handleNewPlaylist = (e) => {
    e.stopPropagation();
    const name = window.prompt("Playlist name:");
    if (name) {
      const newPlaylist = createPlaylist(name);
      addToPlaylist(newPlaylist.id, song);
    }
    setShowPlaylists(false);
  };

  const songImage = song.thumbnail || '';

  return (
    <div
      className={`song-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(song)}
    >
      <div className="card-image-container">
        <img
          src={songImage}
          alt={song.title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />
        
        <div className="card-overlay-actions">
          <button 
            className={`card-action-btn heart ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? "var(--accent-primary)" : "none"} />
          </button>
          
          <button 
            className="card-action-btn plus"
            onClick={(e) => {
              e.stopPropagation();
              setShowPlaylists(!showPlaylists);
            }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="card-play-button">
          <Play fill="black" size={24} color="black" />
        </div>

        {showPlaylists && (
          <div className="playlist-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-header">Add to playlist</div>
            <div className="dropdown-content">
              <button className="dropdown-item create" onClick={handleNewPlaylist}>
                <Plus size={14} /> New Playlist
              </button>
              {playlists.map(p => (
                <button key={p.id} className="dropdown-item" onClick={(e) => handleAddToPlaylist(e, p.id)}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-info">
        <h4 className="card-title">{song.title}</h4>
        <p className="card-artist">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
