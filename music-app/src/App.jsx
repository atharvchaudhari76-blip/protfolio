import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Search from './components/Search';
import Library from './components/Library';
import PlayerBar from './components/PlayerBar';
import AuthModal from './components/AuthModal';
import BottomNav from './components/BottomNav';
import { useAuth } from './context/AuthContext';

function App() {
  const [activeView, setActiveView] = useState('home');
  const { user } = useAuth();

  if (!user) {
    return <AuthModal />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'home': return <Home />;
      case 'search': return <Search />;
      case 'library': return <Library />;
      default: return <Home />;
    }
  };


  return (
    <div className="app-container">
      <div className="sidebar-wrapper">
        <Sidebar 
          setView={setActiveView} 
          activeView={activeView} 
        />
      </div>
      
      <main className="main-content">
        <div className="content-overflow-wrapper">
          {/* Key prop triggers re-animation on view change */}
          <div key={activeView} className="animate-fade-in">
            {renderView()}
          </div>
        </div>
      </main>

      <div className="player-wrapper">
        <PlayerBar />
      </div>
    </div>
  );
}

export default App;


