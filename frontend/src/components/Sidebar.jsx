import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Car size={28} color="var(--accent-color)" />
          <span className="sidebar-brand">Inventory Hub</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          {user?.role === 'admin' && (
            <NavLink 
              to="/add-vehicle" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <PlusCircle size={20} />
              <span>Add Vehicle</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="glass-panel" style={{ padding: '1rem', borderRadius: '8px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dealership Portal</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.7 }}>v1.0.0</p>
          </div>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 45 }} 
          onClick={() => setOpen(false)} 
        />
      )}
    </>
  );
};

export default Sidebar;
