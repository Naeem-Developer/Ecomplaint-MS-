import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard      from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints   from './pages/MyComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminComplaints from './pages/AdminComplaints';
import AdminUsers     from './pages/AdminUsers';
import Profile        from './pages/Profile';
import HelpCenter     from './pages/HelpCenter';
import PrivacyPolicy  from './pages/PrivacyPolicy';
import TermsOfUse     from './pages/TermsOfUse';

import './App.css';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(o => !o);
  const closeSidebar  = () => setSidebarOpen(false);

  // Show full-screen loading only on initial auth check
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--gray-50)' }}>
        <div className="spinner" />
      </div>
    );
  }

  // Pages that should NOT show the app navbar/sidebar (have their own layout)
  const isPublicPage = 
    (!user && ['/', '/login', '/register', '/forgot-password'].includes(location.pathname)) ||
    ['/help', '/privacy', '/terms'].includes(location.pathname);

  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/"               element={<Landing />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/help"           element={<HelpCenter />} />
        <Route path="/privacy"        element={<PrivacyPolicy />} />
        <Route path="/terms"          element={<TermsOfUse />} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Root redirect for logged-in users
  const homeRedirect = user
    ? (user.role === 'admin' ? '/admin' : '/dashboard')
    : '/';

  return (
    <div className="app-layout">
      <Navbar onListToggle={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="app-body">
        {user && <Sidebar open={sidebarOpen} onClose={closeSidebar} />}

        <main className="main-content">
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to={homeRedirect} replace />} />

            {/* Public auth pages (when logged in, redirect away) */}
            <Route path="/login"           element={user ? <Navigate to={homeRedirect} replace /> : <Login />} />
            <Route path="/register"        element={user ? <Navigate to={homeRedirect} replace /> : <Register />} />
            <Route path="/forgot-password" element={user ? <Navigate to={homeRedirect} replace /> : <ForgotPassword />} />

            {/* Student / Faculty */}
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['student', 'faculty']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-complaints" element={
              <ProtectedRoute roles={['student', 'faculty']}>
                <MyComplaints />
              </ProtectedRoute>
            } />
            <Route path="/submit-complaint" element={
              <ProtectedRoute roles={['student', 'faculty']}>
                <SubmitComplaint />
              </ProtectedRoute>
            } />
            <Route path="/complaint/:id" element={
              <ProtectedRoute>
                <ComplaintDetail />
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
              <ProtectedRoute roles={['admin']}>
                <AdminComplaints />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />

            {/* Shared */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Navigate to={homeRedirect} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
