import { I18nProvider } from 'react-aria-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthenticatedRoute } from './components/layout/AuthenticatedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { GearPage } from './pages/GearPage';
import { ArmorPage } from './pages/ArmorPage';
import { WeaponsPage } from './pages/WeaponsPage';
import { SkillsPage } from './pages/SkillsPage';
import { QualitiesPage } from './pages/QualitiesPage';
import { BooksPage } from './pages/BooksPage';
import { LifestylesPage } from './pages/LifestylesPage';

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
                {/* Admin-only routes - Database tab redirects to Gear (first nested tab) */}
                <Route
                  path="/database"
                  element={
                    <AdminRoute>
                      <Navigate to="/gear" replace />
                    </AdminRoute>
                  }
                />
                {/* Admin-only routes - Gear, Armor, Weapons, Skills, and Qualities (shown under Database tab) */}
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
                <Route
                  path="/weapons"
                  element={
                    <AdminRoute>
                      <WeaponsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <AdminRoute>
                      <SkillsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/qualities"
                  element={
                    <AdminRoute>
                      <QualitiesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <AdminRoute>
                      <BooksPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/lifestyles"
                  element={
                    <AdminRoute>
                      <LifestylesPage />
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
