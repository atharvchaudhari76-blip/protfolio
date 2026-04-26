import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Search from './components/Search';
import Library from './components/Library';
import NowPlaying from './components/NowPlaying';
import PlayerBar from './components/PlayerBar';
import AuthModal from './components/AuthModal';
import BottomNav from './components/BottomNav';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <AuthModal />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home': return <Home />;
      case 'search': return <Search />;
      case 'library': return <Library setView={setActiveView} />;
      case 'nowplaying': return <NowPlaying goBack={() => setActiveView('home')} />;
      default: return <Home />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isNowPlaying = activeView === 'nowplaying';

  return (
    <div className={`app-container ${isNowPlaying ? 'np-mode' : ''}`}>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      <div className={`sidebar-wrapper ${isSidebarOpen ? 'active' : ''}`}>
        <Sidebar 
          setView={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
          }} 
          activeView={activeView} 
        />
      </div>
      
      <main className="main-content">
        <div className="content-overflow-wrapper">
          <div key={activeView} className="animate-fade-in">
            {renderView()}
          </div>
        </div>
      </main>

      {/* Always render player-wrapper to maintain grid, but hide its content in NP mode */}
      <div className="player-wrapper" style={isNowPlaying ? { display: 'none' } : {}}>
        <PlayerBar onOpenNowPlaying={() => setActiveView('nowplaying')} />
      </div>

      <BottomNav 
        activeView={activeView} 
        setView={setActiveView} 
        toggleSidebar={toggleSidebar} 
      />
    </div>
  );
}

export default App;
