import React from 'react';
import { Home, Search, Library, User } from 'lucide-react';

const Sidebar = ({ setView, activeView }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'library', icon: Library, label: 'Your Library' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>AesthetiCore</h1>
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

