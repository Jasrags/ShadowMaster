import { forwardRef, InputHTMLAttributes } from 'react';

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'search';
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, variant = 'default', type = 'text', ...rest }, ref) => {
    const classes = ['form-input'];
    if (variant === 'search') {
      classes.push('form-input--search');
    }
    if (className) {
      classes.push(className);
    }

    return <input ref={ref} type={type} className={classes.join(' ')} {...rest} />;
  },
);

TextInput.displayName = 'TextInput';

