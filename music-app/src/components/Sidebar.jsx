import React from 'react';
import { Home, Search, Library, Plus, ArrowRight } from 'lucide-react';

const Sidebar = ({ setView, activeView }) => {
  return (
    <div className="sidebar">
      {/* Block 1: Navigation */}
      <div className="sidebar-section nav-section">
        <button
          className={`nav-item ${activeView === 'home' ? 'active' : ''}`}
          onClick={() => setView('home')}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button
          className={`nav-item ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => setView('search')}
        >
          <Search size={24} />
          <span>Search</span>
        </button>
      </div>

      {/* Block 2: Your Library */}
      <div className="sidebar-section library-section">
        <div className="library-header">
          <button 
            className={`nav-item ${activeView === 'library' ? 'active' : ''}`}
            onClick={() => setView('library')}
          >
            <Library size={24} />
            <span>Your Library</span>
          </button>
          <div className="library-actions">
            <button className="icon-btn" title="Create playlist" onClick={() => alert('Playlist created successfully!')}><Plus size={20} /></button>
            <button className="icon-btn" title="Show more"><ArrowRight size={20} /></button>
          </div>
        </div>
        
        <div className="library-content">
          <div className="sidebar-card">
            <h4>Create your first playlist</h4>
            <p>It's easy, we'll help you</p>
            <button className="pill-btn" onClick={() => alert('Playlist created successfully!')}>Create playlist</button>
          </div>
          <div className="sidebar-card">
            <h4>Let's find some podcasts to follow</h4>
            <p>We'll keep you updated on new episodes</p>
            <button className="pill-btn" onClick={() => setView('search')}>Browse podcasts</button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="footer-links">
            <a href="#">Legal</a>
            <a href="#">Safety & Privacy Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
            <a href="#">About Ads</a>
            <a href="#">Accessibility</a>
          </div>
          <button className="lang-btn">
             English
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

