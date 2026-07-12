import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-text">
        The page you are looking for doesn't exist or has been moved. Let's get you back to your inventory.
      </p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.875rem 2rem' }}>
        <LayoutDashboard size={20} />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
