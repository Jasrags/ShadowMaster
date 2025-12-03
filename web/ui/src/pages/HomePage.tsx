import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { ToastContainer, ToastType } from '../components/Toast';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function HomePage() {
  const { user, isLoading } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const closeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-sr-text-dim">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={closeToast} />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="font-tech text-5xl md:text-6xl mb-4 text-glow-cyan">
            ShadowMaster
          </h1>
          <p className="text-xl text-sr-text-dim font-body">
            Shadowrun Character Management System
          </p>
        </div>

        {/* Buttons Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-cyber-primary">Primary Action</button>
            <button className="btn-cyber">Secondary Action</button>
            <button className="btn-cyber" disabled>Disabled</button>
            <Link to="/login" className="btn-cyber-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn-cyber">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Cards Showcase */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-cyber p-6">
            <h3 className="font-tech text-2xl mb-4 text-sr-accent">Character Sheet</h3>
            <p className="text-sr-text-dim mb-4 font-body">
              Manage your Shadowrun characters with full attribute and skill systems.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="badge-cyber-accent">SR3</span>
              <span className="badge-cyber-accent">SR5</span>
            </div>
            <button className="btn-cyber text-sm">View Characters</button>
          </div>

          <div className="card-cyber p-6">
            <h3 className="font-tech text-2xl mb-4 text-sr-secondary">Campaign Manager</h3>
            <p className="text-sr-text-dim mb-4 font-body">
              Organize your Shadowrun campaigns, sessions, and scenes.
            </p>
            <div className="flex gap-2 mb-4">
              <span className="badge-cyber-success">Active</span>
              <span className="badge-cyber-warning">In Progress</span>
            </div>
            <button className="btn-cyber text-sm">Manage Campaigns</button>
          </div>
        </div>

        {/* Form Elements Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Form Elements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-sr-text-dim mb-2">
                Character Name
              </label>
              <input
                type="text"
                className="input-cyber w-full"
                placeholder="Enter character name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sr-text-dim mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-cyber w-full"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sr-text-dim mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-cyber w-full"
                placeholder="Enter password..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sr-text-dim mb-2">
                Select Metatype
              </label>
              <select className="input-cyber w-full">
                <option>Human</option>
                <option>Elf</option>
                <option>Dwarf</option>
                <option>Ork</option>
                <option>Troll</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Badges Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Status Badges</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="badge-cyber-accent">Accent</span>
            <span className="badge-cyber-success">Success</span>
            <span className="badge-cyber-warning">Warning</span>
            <span className="badge-cyber-danger">Danger</span>
            <div className="flex gap-2">
              <span className="badge-cyber-accent">Administrator</span>
              <span className="badge-cyber-success">Online</span>
            </div>
          </div>
        </div>

        {/* Toast Messages Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Toast Messages</h2>
          <p className="text-sr-text-dim mb-6 font-body">
            Click the buttons below to see toast notifications with different status types.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => showToast('Character saved successfully!', 'success')}
              className="btn-cyber"
            >
              Show Success Toast
            </button>
            <button
              onClick={() => showToast('Warning: Low karma remaining', 'warning')}
              className="btn-cyber"
            >
              Show Warning Toast
            </button>
            <button
              onClick={() => showToast('Error: Failed to save character', 'error')}
              className="btn-cyber"
            >
              Show Error Toast
            </button>
          </div>
        </div>

        {/* Typography Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="font-tech text-4xl mb-2">Heading 1 - Tech Font</h1>
              <p className="text-sr-text-dim text-sm font-mono">font-tech (Orbitron/Rajdhani)</p>
            </div>
            <div className="divider-cyber my-4"></div>
            <div>
              <h2 className="font-tech text-3xl mb-2">Heading 2 - Tech Font</h2>
              <p className="text-sr-text-dim text-sm font-mono">font-tech (Orbitron/Rajdhani)</p>
            </div>
            <div className="divider-cyber my-4"></div>
            <div>
              <p className="font-body text-lg mb-2">
                Body text uses the Inter font family for optimal readability. This ensures
                that all content is easy to read while maintaining the cyberpunk aesthetic.
              </p>
              <p className="text-sr-text-dim text-sm font-mono">font-body (Inter)</p>
            </div>
            <div className="divider-cyber my-4"></div>
            <div>
              <code className="font-mono text-sm bg-sr-darker px-2 py-1 rounded border border-sr-light-gray">
                const shadowrun = "cyberpunk";
              </code>
              <p className="text-sr-text-dim text-sm font-mono mt-2">font-mono (JetBrains Mono)</p>
            </div>
            <div className="divider-cyber my-4"></div>
            <div>
              <p className="text-glow-cyan font-tech text-2xl mb-2">
                Glowing Text Effect
              </p>
              <p className="text-sr-text-dim text-sm font-mono">text-glow-cyan utility</p>
            </div>
          </div>
        </div>

        {/* Color Palette Showcase */}
        <div className="card-cyber p-8">
          <h2 className="font-tech text-3xl mb-6 text-glow-cyan">Color Palette</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-sr-accent rounded border border-sr-accent shadow-glow-cyan"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-accent</p>
              <p className="text-xs text-sr-text-muted">#00d4ff</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-sr-secondary rounded border border-sr-secondary shadow-glow-magenta"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-secondary</p>
              <p className="text-xs text-sr-text-muted">#ff00ff</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-sr-tertiary rounded border border-sr-tertiary shadow-glow-blue"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-tertiary</p>
              <p className="text-xs text-sr-text-muted">#0066ff</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-sr-success rounded border border-sr-success shadow-glow-success"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-success</p>
              <p className="text-xs text-sr-text-muted">#00ff88</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-sr-danger rounded border border-sr-danger shadow-glow-danger"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-danger</p>
              <p className="text-xs text-sr-text-muted">#ff3366</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-sr-warning rounded border border-sr-warning shadow-glow-warning"></div>
              <p className="text-sm font-mono text-sr-text-dim">sr-warning</p>
              <p className="text-xs text-sr-text-muted">#ffaa00</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {!user && (
          <div className="card-cyber p-8 text-center">
            <h2 className="font-tech text-3xl mb-4 text-glow-cyan">Get Started</h2>
            <p className="text-sr-text-dim mb-6 font-body">
              Sign in or create an account to start managing your Shadowrun characters and campaigns.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn-cyber-primary">
                Sign In
              </Link>
              <Link to="/register" className="btn-cyber">
                Sign Up
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

