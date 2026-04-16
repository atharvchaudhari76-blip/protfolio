import React from 'react';
import { Play } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const SongCard = ({ song, onClick }) => {
  const { currentTrack, isPlaying } = useAudio();
  const isActive = currentTrack?.id === song.id;

  return (
    <div
      className={`song-card ${isActive ? 'active' : ''}`}
      onClick={() => onClick(song)}
    >
      <div className="card-image-container">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="card-image"
        />
        <div className="card-play-button">
          <Play fill="black" size={24} color="black" />
        </div>
      </div>

      <div className="card-info">
        <h4 className="card-title">{song.title}</h4>
        <p className="card-artist">{song.artist}</p>
      </div>
    </div>
  );
};

export default SongCard;
