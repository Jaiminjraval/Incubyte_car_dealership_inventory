import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddVehicle from './pages/AddVehicle';
import EditVehicle from './pages/EditVehicle';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

function App() {
  return (
    <ErrorBoundary>
      <Toaster 
        toastOptions={{
          style: {
            background: 'var(--panel-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--panel-border)',
            backdropFilter: 'blur(12px)'
          }
        }} 
      />
      <Routes>
        {/* Public Routes without Layout */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Routes wrapped in Layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-vehicle" 
          element={
            <AdminRoute>
              <Layout>
                <AddVehicle />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/edit-vehicle/:id" 
          element={
            <AdminRoute>
              <Layout>
                <EditVehicle />
              </Layout>
            </AdminRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
