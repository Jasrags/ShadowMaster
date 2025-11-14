import { useState, FormEvent } from 'react';
import { Button, TextField, Label, FieldError } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Email</Label>
        <input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="your@email.com"
        />
        <FieldError className="text-sm text-sr-danger" />
      </TextField>

      <TextField
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        isRequired
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Password</Label>
        <input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="••••••••"
        />
        <FieldError className="text-sm text-sr-danger" />
      </TextField>

      {displayError && (
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-md text-red-400 text-sm">
          {displayError}
        </div>
      )}

      <Button
        type="submit"
        isDisabled={isSubmitting}
        className="w-full px-4 py-2 bg-sr-accent hover:bg-sr-accent-dark text-sr-dark font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

