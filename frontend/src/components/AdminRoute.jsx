import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not an admin, redirect to dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If admin, render the requested component
  return children;
};

export default AdminRoute;
