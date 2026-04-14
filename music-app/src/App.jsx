import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Search from './components/Search';
import Library from './components/Library';
import PlayerBar from './components/PlayerBar';

function App() {
  const [activeView, setActiveView] = useState('home');

  const renderView = () => {
    switch (activeView) {
      case 'home': return <Home />;
      case 'search': return <Search />;
      case 'library': return <Library />;
      default: return <Home />;
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar setView={setActiveView} activeView={activeView} />
      
      <main className="main-content">
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
          {renderView()}
        </div>
      </main>

      <PlayerBar />
    </div>
  );
}

export default App;
