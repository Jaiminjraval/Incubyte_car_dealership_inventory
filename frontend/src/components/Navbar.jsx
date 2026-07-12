import React, { useContext } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="top-navbar">
      <div className="flex-center" style={{ gap: '1rem' }}>
        <button 
          className="btn-icon mobile-menu-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      <div className="nav-user">
        <div className="user-info hide-mobile">
          <span className="user-name">{user?.name}</span>
          <span className="badge">{user?.role}</span>
        </div>
        <button onClick={logout} className="btn-icon" title="Logout">
          <LogOut size={20} />
          <span className="hide-mobile" style={{ marginLeft: '0.25rem' }}>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
