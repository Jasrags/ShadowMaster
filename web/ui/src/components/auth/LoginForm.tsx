import { useState, FormEvent } from 'react';
import { Button, TextField, Input, Label, FieldError } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { validateEmail } from '../../lib/validation';

export function LoginForm() {
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  function validateForm(): boolean {
    let isValid = true;

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      showSuccess('Login successful', 'Welcome back!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      showError('Login failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEmailBlur() {
    setTouched((prev) => ({ ...prev, email: true }));
    const error = validateEmail(email);
    setEmailError(error);
  }

  function handlePasswordBlur() {
    setTouched((prev) => ({ ...prev, password: true }));
    if (!password) {
      setPasswordError('Password is required');
    } else {
      setPasswordError(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        name="email"
        type="email"
        value={email}
        onChange={setEmail}
        onBlur={handleEmailBlur}
        isRequired
        isInvalid={touched.email && emailError !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Email</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="your@email.com"
        />
        {touched.email && emailError && (
          <FieldError className="text-sm text-sr-danger">{emailError}</FieldError>
        )}
      </TextField>

      <TextField
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        onBlur={handlePasswordBlur}
        isRequired
        isInvalid={touched.password && passwordError !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Password</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="••••••••"
        />
        {touched.password && passwordError && (
          <FieldError className="text-sm text-sr-danger">{passwordError}</FieldError>
        )}
      </TextField>

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

