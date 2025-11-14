import { useState, FormEvent } from 'react';
import { Button, TextField, Input, Label, FieldError } from 'react-aria-components';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { validateEmail, validatePassword, validatePasswordMatch, validateUsername } from '../../lib/validation';
import { PasswordRequirements } from './PasswordRequirements';

export function RegisterForm() {
  const { register } = useAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: null as string | null,
    username: null as string | null,
    password: null as string | null,
    confirmPassword: null as string | null,
  });
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  function validateForm(): boolean {
    const newErrors = {
      email: validateEmail(email),
      username: validateUsername(username),
      password: validatePassword(password),
      confirmPassword: validatePasswordMatch(password, confirmPassword),
    };

    setErrors(newErrors);
    setTouched({ email: true, username: true, password: true, confirmPassword: true });

    return !Object.values(newErrors).some((error) => error !== null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      // Show first error as toast
      const newErrors = {
        email: validateEmail(email),
        username: validateUsername(username),
        password: validatePassword(password),
        confirmPassword: validatePasswordMatch(password, confirmPassword),
      };
      const firstError = Object.values(newErrors).find((err) => err !== null);
      if (firstError) {
        showError('Validation error', firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email.trim(), username.trim(), password);
      showSuccess('Registration successful', 'Your account has been created!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      showError('Registration failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEmailBlur() {
    setTouched((prev) => ({ ...prev, email: true }));
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  }

  function handleUsernameBlur() {
    setTouched((prev) => ({ ...prev, username: true }));
    setErrors((prev) => ({ ...prev, username: validateUsername(username) }));
  }

  function handlePasswordBlur() {
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(password),
      confirmPassword: password ? validatePasswordMatch(password, confirmPassword) : prev.confirmPassword,
    }));
  }

  function handleConfirmPasswordBlur() {
    setTouched((prev) => ({ ...prev, confirmPassword: true }));
    setErrors((prev) => ({ ...prev, confirmPassword: validatePasswordMatch(password, confirmPassword) }));
  }

  function handlePasswordChange(newPassword: string) {
    setPassword(newPassword);
    // Re-validate confirm password if it's been touched
    if (touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validatePasswordMatch(newPassword, confirmPassword),
      }));
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
        isInvalid={touched.email && errors.email !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Email</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="your@email.com"
        />
        {touched.email && errors.email && (
          <FieldError className="text-sm text-sr-danger">{errors.email}</FieldError>
        )}
      </TextField>

      <TextField
        name="username"
        type="text"
        value={username}
        onChange={setUsername}
        onBlur={handleUsernameBlur}
        isRequired
        isInvalid={touched.username && errors.username !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Username</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="username"
        />
        {touched.username && errors.username && (
          <FieldError className="text-sm text-sr-danger">{errors.username}</FieldError>
        )}
      </TextField>

      <TextField
        name="password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handlePasswordBlur}
        isRequired
        isInvalid={touched.password && errors.password !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Password</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="••••••••"
        />
        {touched.password && errors.password && (
          <FieldError className="text-sm text-sr-danger">{errors.password}</FieldError>
        )}
        <PasswordRequirements password={password} />
      </TextField>

      <TextField
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        onBlur={handleConfirmPasswordBlur}
        isRequired
        isInvalid={touched.confirmPassword && errors.confirmPassword !== null}
        validationBehavior="aria"
        className="flex flex-col gap-1"
      >
        <Label className="text-sm font-medium text-gray-300">Confirm Password</Label>
        <Input
          className="px-3 py-2 bg-sr-gray border border-sr-light-gray rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-sr-accent focus:border-transparent data-[invalid]:border-red-500/50"
          placeholder="••••••••"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <FieldError className="text-sm text-sr-danger">{errors.confirmPassword}</FieldError>
        )}
      </TextField>

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

