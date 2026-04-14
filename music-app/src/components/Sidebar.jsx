import React from 'react';
import { Home, Search, Library, Heart, ListMusic, Music2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const Sidebar = ({ setView, activeView }) => {
  const { library } = useAudio();

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Library' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ 
          background: 'var(--accent-primary)', 
          padding: '8px', 
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
        }}>
          <Music2 size={24} color="white" />
        </div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '22px', letterSpacing: '-0.5px' }}>AesthetiCore</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`btn ${activeView === item.id ? 'active' : ''}`}
            style={{
              justifyContent: 'flex-start',
              padding: '12px 16px',
              borderRadius: '10px',
              gap: '16px',
              background: activeView === item.id ? 'var(--bg-glass)' : 'transparent',
              color: activeView === item.id ? 'var(--text-main)' : 'var(--text-muted)',
              border: activeView === item.id ? '1px solid var(--border-glass)' : '1px solid transparent'
            }}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
        <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          Your Collection
        </h3>
        <button
          onClick={() => setView('library')}
          className="btn"
          style={{
            justifyContent: 'flex-start',
            padding: '8px 0',
            gap: '16px',
          }}
        >
          <Heart size={20} />
          <span>Liked Songs ({library.length})</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
