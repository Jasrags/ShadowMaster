import { useAuth } from '../contexts/AuthContext';
import { AuthPanel } from '../components/auth/AuthPanel';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // AuthPanel handles its own full-screen layout
    return (
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8">
        <AuthPanel />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">
          Welcome to ShadowMaster, {user?.username || 'User'}!
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Your RPG campaign management system
        </p>
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-6 text-left">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Getting Started</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-sr-accent mr-2">•</span>
              <span>Create or join a campaign from the <strong className="text-gray-100">Campaigns</strong> tab</span>
            </li>
            <li className="flex items-start">
              <span className="text-sr-accent mr-2">•</span>
              <span>Manage your characters and sessions</span>
            </li>
            <li className="flex items-start">
              <span className="text-sr-accent mr-2">•</span>
              <span>Track your progress and adventures</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

