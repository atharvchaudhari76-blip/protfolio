import React, { useState } from 'react';
import { Search as SearchIcon, Music } from 'lucide-react';

const mockSearchResults = {
  top: [
    { id: 1, title: 'Top Songs', type: 'songs', image: 'https://picsum.photos/80/80?random=10', count: 5 },
    { id: 2, title: 'Top Artists', type: 'artists', image: 'https://picsum.photos/80/80?random=11', count: 4 },
  ],
  songs: [
    { id: 1, title: 'Search Result Song 1', artist: 'Artist A', duration: '3:30' },
    { id: 2, title: 'Search Result Song 2', artist: 'Artist B', duration: '2:58' },
  ],
  artists: [
    { id: 1, title: 'Artist One', image: 'https://picsum.photos/60/60?random=12' },
    { id: 2, title: 'Artist Two', image: 'https://picsum.photos/60/60?random=13' },
  ],
};

const Search = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="search">
      <div className="search-header">
        <div className="search-bar">
          <SearchIcon size={20} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {query ? (
        <div className="search-results">
          <section className="top-results">
            <h3>Top results</h3>
            <div className="top-grid">
              {mockSearchResults.top.map((item) => (
                <div key={item.id} className="top-result">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.type} • {item.count} total</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="songs-results">
            <h3>Songs</h3>
            <div className="tracks-grid">
              {mockSearchResults.songs.map((song) => (
                <div key={song.id} className="track-item">
                  <div className="track-play">
                    <Music size={20} />
                  </div>
                  <div className="track-info">
                    <p className="track-title">{song.title}</p>
                    <p className="track-artist">{song.artist}</p>
                  </div>
                  <span className="track-duration">{song.duration}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="artists-results">
            <h3>Artists</h3>
            <div className="artists-grid">
              {mockSearchResults.artists.map((artist) => (
                <div key={artist.id} className="artist-card">
                  <img src={artist.image} alt={artist.title} />
                  <h4>{artist.title}</h4>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="search-empty">
          <SearchIcon size={64} />
          <h3>Start typing to search</h3>
          <p>Songs, artists, podcasts and more</p>
        </div>
      )}
    </div>
  );
};

export default Search;

