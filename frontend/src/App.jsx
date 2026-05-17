import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// User Pages
import Landing from './pages/user/Landing';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Dashboard from './pages/user/Dashboard';
import NearbyOffices from './pages/user/NearbyOffices';
import OfficeDetail from './pages/user/OfficeDetail';
import MyTokens from './pages/user/MyTokens';
import QueueStatus from './pages/user/QueueStatus';
import Profile from './pages/user/Profile';
// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import QueueManagement from './pages/admin/QueueManagement';
import SuperAdmin from './pages/admin/SuperAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/nearby" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <NearbyOffices />
            </ProtectedRoute>
          } />
          <Route path="/office/:id" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <OfficeDetail />
            </ProtectedRoute>
          } />
          <Route path="/my-tokens" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <MyTokens />
            </ProtectedRoute>
          } />
          <Route path="/queue-status/:id" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <QueueStatus />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/queue" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <QueueManagement />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdmin />
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
