import { I18nProvider } from 'react-aria-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AppLayout } from './components/layout/AppLayout.tsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { CharactersPage } from './pages/CharactersPage.tsx';
import { CharacterSheetPage } from './pages/CharacterSheetPage.tsx';
import { UsersPage } from './pages/UsersPage.tsx';

function App() {
  return (
    <I18nProvider locale="en-US">
      <AuthProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/characters"
                element={
                  <ProtectedRoute>
                    <CharactersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/characters/:id"
                element={
                  <ProtectedRoute>
                    <CharacterSheetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireRole="administrator">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;

