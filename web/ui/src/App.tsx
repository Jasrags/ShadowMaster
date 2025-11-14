import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { CampaignList } from './components/campaigns/CampaignList';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProtectedRoute>
          <AppLayout>
            <div>
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Campaigns</h2>
              <CampaignList />
            </div>
          </AppLayout>
        </ProtectedRoute>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

