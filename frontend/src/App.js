import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import TrainerDashboard from './components/dashboard/TrainerDashboard';
import TraineeDashboard from './components/dashboard/TraineeDashboard';
import Programs from './components/programs/Programs';
import Batches from './components/batches/Batches';
import Progress from './components/progress/Progress';
import Users from './components/users/Users';
import Layout from './components/layout/Layout';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component - can be used for future route protection
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// Main App component
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  const getDashboardComponent = () => {
    if (!user) return <Login />;

    switch (user.role) {
      case 'admin':
        return <SuperAdminDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'trainee':
        return <TraineeDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <Layout>
            <Routes>
              <Route path="/" element={getDashboardComponent()} />
              <Route path="/admin-dashboard" element={<SuperAdminDashboard />} />
              <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
              <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/users" element={<Users />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/forgot-password" element={<Navigate to="/" replace />} />
              <Route path="/reset-password" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
