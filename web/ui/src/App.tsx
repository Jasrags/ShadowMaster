import { I18nProvider } from 'react-aria-components';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <I18nProvider locale="en-US">
      <ToastProvider>
        <AuthProvider>
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
