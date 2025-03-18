import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';
import { UserDashboard } from './pages/Dashboard/UserDashboard';
import { StationDashboard } from './pages/Dashboard/StationDashboard';
import { UserManagement } from './pages/Admin/UserManagement';
import { StationManagement } from './pages/Admin/StationManagement';
import { RequestMonitoring } from './pages/Admin/RequestMonitoring';
import { Analytics } from './pages/Admin/Analytics';
import { SystemHealth } from './pages/Admin/SystemHealth';
import { RequestFuel } from './pages/User/RequestFuel';
import { MyRequests } from './pages/User/MyRequests';
import { initializeStorage } from './utils/localStorage';

// Initialize local storage with default data
initializeStorage();

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard/*" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Go Back
                </button>
              </div>
            </div>
          } />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'admin':
      return (
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="stations" element={<StationManagement />} />
          <Route path="requests" element={<RequestMonitoring />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="system" element={<SystemHealth />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'user':
      return (
        <Routes>
          <Route index element={<UserDashboard />} />
          <Route path="request" element={<RequestFuel />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    case 'station':
      return (
        <Routes>
          <Route index element={<StationDashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      );
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default App;