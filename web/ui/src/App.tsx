import { I18nProvider } from 'react-aria-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthenticatedRoute } from './components/layout/AuthenticatedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { GearPage } from './pages/GearPage';
import { ArmorPage } from './pages/ArmorPage';

function App() {
  return (
    <I18nProvider locale="en-US">
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public route */}
                <Route path="/" element={<HomePage />} />
                {/* Protected routes */}
                <Route
                  path="/campaigns"
                  element={
                    <AuthenticatedRoute>
                      <CampaignsPage />
                    </AuthenticatedRoute>
                  }
                />
                {/* Admin-only routes */}
                <Route
                  path="/gear"
                  element={
                    <AdminRoute>
                      <GearPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/armor"
                  element={
                    <AdminRoute>
                      <ArmorPage />
                    </AdminRoute>
                  }
                />
                {/* Add more protected routes here as needed */}
                {/* <Route
                  path="/characters"
                  element={
                    <AuthenticatedRoute>
                      <CharactersPage />
                    </AuthenticatedRoute>
                  }
                /> */}
                {/* <Route
                  path="/sessions"
                  element={
                    <AuthenticatedRoute>
                      <SessionsPage />
                    </AuthenticatedRoute>
                  }
                /> */}
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
