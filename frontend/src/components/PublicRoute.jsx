import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // If user is already logged in, prevent them from accessing login/register pages
  // and redirect them back to the dashboard.
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
