import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import { QueueProvider } from './context/QueueContext';
import { AlertProvider } from './context/AlertContext';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import UserPanel from './pages/UserPanel';
import Map from './pages/Map';
import AssetDetails from './pages/AssetDetails';
import QueueStatus from './pages/QueueStatus';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children, isAdmin = false }) => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin) {
    const userData = JSON.parse(user);
    if (!userData.is_admin) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AssetProvider>
        <QueueProvider>
          <AlertProvider>
            <BrowserRouter>
              <ToastProvider />
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* User Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <UserPanel />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      <PrivateRoute>
                        <Map />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/asset/:id"
                    element={
                      <PrivateRoute>
                        <AssetDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/queue-status"
                    element={
                      <PrivateRoute>
                        <QueueStatus />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <PrivateRoute>
                        <Alerts />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  
                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute isAdmin={true}>
                        <AdminPanel />
                      </PrivateRoute>
                    }
                  />
                  
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </BrowserRouter>
          </AlertProvider>
        </QueueProvider>
      </AssetProvider>
    </AuthProvider>
  );
}

export default App;
