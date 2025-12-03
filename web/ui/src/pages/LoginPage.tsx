import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Input, Label } from 'react-aria-components';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">ShadowMaster</h1>
          <p className="text-gray-400 mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-sr-danger/20 border border-sr-danger rounded-md text-sr-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              type="email"
              value={email}
              onChange={setEmail}
              isRequired
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300">Email</Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                placeholder="you@example.com"
              />
            </TextField>

            <TextField
              type="password"
              value={password}
              onChange={setPassword}
              isRequired
              className="flex flex-col gap-1"
            >
              <Label className="text-sm font-medium text-gray-300">Password</Label>
              <Input
                className="px-3 py-2 bg-sr-darker border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
                placeholder="Enter your password"
              />
            </TextField>

            <Button
              type="submit"
              isDisabled={isLoading}
              className="w-full px-4 py-2 bg-sr-accent border border-sr-accent rounded-md text-gray-100 hover:bg-sr-accent/80 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-sr-accent hover:text-sr-accent/80 underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

