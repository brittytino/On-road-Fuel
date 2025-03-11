import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';
import { UserDashboard } from './pages/Dashboard/UserDashboard';
import { StationDashboard } from './pages/Dashboard/StationDashboard';
import { initializeStorage } from './utils/localStorage';

// Initialize local storage with default data
initializeStorage();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRouter />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Unauthorized Access
                  </h1>
                  <p className="text-gray-600 mb-4">
                    You don't have permission to access this page.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'user':
      return <UserDashboard />;
    case 'station':
      return <StationDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default App;