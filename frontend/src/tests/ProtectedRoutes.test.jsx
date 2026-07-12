import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import PublicRoute from '../components/PublicRoute';

const MockComponent = ({ name }) => <div>{name}</div>;

const renderRoute = (routeComponent, initialEntry, contextValue) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/test" element={routeComponent} />
          <Route path="/login" element={<MockComponent name="Login Page" />} />
          <Route path="/" element={<MockComponent name="Dashboard Page" />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Route Guards', () => {
  describe('ProtectedRoute', () => {
    it('renders children when authenticated', () => {
      renderRoute(
        <ProtectedRoute><MockComponent name="Protected Content" /></ProtectedRoute>,
        '/test',
        { user: { name: 'User' }, loading: false }
      );
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when unauthenticated', () => {
      renderRoute(
        <ProtectedRoute><MockComponent name="Protected Content" /></ProtectedRoute>,
        '/test',
        { user: null, loading: false }
      );
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('renders children when admin', () => {
      renderRoute(
        <AdminRoute><MockComponent name="Admin Content" /></AdminRoute>,
        '/test',
        { user: { role: 'admin' }, loading: false }
      );
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('redirects to dashboard when user is not admin', () => {
      renderRoute(
        <AdminRoute><MockComponent name="Admin Content" /></AdminRoute>,
        '/test',
        { user: { role: 'user' }, loading: false }
      );
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  describe('PublicRoute', () => {
    it('renders children when unauthenticated', () => {
      renderRoute(
        <PublicRoute><MockComponent name="Public Content" /></PublicRoute>,
        '/test',
        { user: null, loading: false }
      );
      expect(screen.getByText('Public Content')).toBeInTheDocument();
    });

    it('redirects to dashboard when authenticated', () => {
      renderRoute(
        <PublicRoute><MockComponent name="Public Content" /></PublicRoute>,
        '/test',
        { user: { name: 'User' }, loading: false }
      );
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });
});
