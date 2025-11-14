import { useState, FormEvent } from 'react';
import { Button, TextField, Input, Label, FieldError } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';

export function RegisterForm() {
  const { register, error } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, username, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registration failed');
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
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="your@email.com"
        />
        <FieldError className="text-sm text-sr-danger" />
      </TextField>

      <TextField
        name="username"
        type="text"
        value={username}
        onChange={setUsername}
        isRequired
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Username</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="username"
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
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent"
          placeholder="••••••••"
        />
        <FieldError className="text-sm text-sr-danger" />
        <div className="text-xs text-gray-400 mt-1">
          Must be at least 8 characters with uppercase, lowercase, and number
        </div>
      </TextField>

      <TextField
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        isRequired
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Confirm Password</Label>
        <Input
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
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}

