import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function Home() {
  const navigate = useNavigate();
  const { user, signout } = useAuthStore();

  const handleSignout = async () => {
    await signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              ShadowMaster
            </h1>
            <p className="text-muted-foreground text-lg">
              Shadowrun Character Manager
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm text-foreground font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">Role: {user.role}</p>
              </div>
            )}
            <button
              onClick={handleSignout}
              className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Foundation setup complete. Ready to build!
          </p>
          {user && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-foreground">
                Welcome, {user.username}! You are signed in as {user.role}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

