import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';
import { useAuthStore } from './stores/authStore';

function App() {
  const { getCurrentUser, token } = useAuthStore();

  // Load current user on app initialization if token exists
  useEffect(() => {
    if (token) {
      getCurrentUser().catch(() => {
        // Token might be invalid, clearAuth will be called by API client
      });
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <Signup />
          </AuthLayout>
        }
      />
      <Route
        path="/signin"
        element={
          <AuthLayout>
            <Signin />
          </AuthLayout>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requireRole="administrator">
            <UserManagement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

