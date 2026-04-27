import React, { useState, useEffect } from 'react';
import { Home, Search, Library, Plus, ArrowRight, LogOut, Download, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';

const Sidebar = ({ setView, activeView }) => {
  const { logout, user } = useAuth();
  const { createPlaylist } = useAudio();
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const handleCreatePlaylist = () => {
    const name = window.prompt("Playlist name:");
    if (name) {
      createPlaylist(name);
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isStandaloneMode);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setDeferredPrompt(null);
      });
    } else if (isIOS) {
      alert("To install AesthetiCore on your iPhone:\n\n1. Tap the 'Share' button at the bottom of Safari.\n2. Tap 'Add to Home Screen'.");
    } else {
      alert("To install AesthetiCore:\n\n1. Tap the three dots (menu) in your browser.\n2. Tap 'Install App' or 'Add to Home Screen'.\n\nIf you don't see it, wait 5 seconds for the app to finish loading and try again!");
    }
  };

  const showInstallButton = (deferredPrompt || isIOS || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

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

        {showInstallButton && (
          <div className="install-banner" style={{ padding: '8px 16px', marginTop: '8px' }}>
            <button
              className="pill-btn"
              onClick={handleInstallClick}
              style={{ 
                width: '100%', 
                background: 'var(--accent-primary)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={18} />
              <span>Install App</span>
            </button>
          </div>
        )}
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
            <button className="icon-btn" title="Create playlist" onClick={handleCreatePlaylist}><Plus size={20} /></button>
            <button className="icon-btn" title="Show more"><ArrowRight size={20} /></button>
          </div>
        </div>
        
        <div className="library-content">
          <div className="sidebar-card">
            <h4>Create your first playlist</h4>
            <p>It's easy, we'll help you</p>
            <button className="pill-btn" onClick={handleCreatePlaylist}>Create playlist</button>
          </div>
          <div className="sidebar-card">
            <h4>Let's find some podcasts to follow</h4>
            <p>We'll keep you updated on new episodes</p>
            <button className="pill-btn" onClick={() => setView('search')}>Browse podcasts</button>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
              <button className="logout-btn" onClick={logout} title="Logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
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
    </div>
  );
};

export default Sidebar;

