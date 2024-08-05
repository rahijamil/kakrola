import React from 'react';

// Simplified utility function to combine class names
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Simplified type for button variants
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'danger' | 'gray';
type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon';

const getButtonClasses = (
  variant: ButtonVariant = 'default',
  size: ButtonSize = 'default',
  fullWidth: boolean = false,
  className?: string
) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:to-indigo-600',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-indigo-600 hover:bg-indigo-50',
    secondary: 'bg-white text-indigo-600 hover:bg-gray-100',
    gray: 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-600 hover:to-gray-300',
    danger: 'text-white bg-gradient-to-r from-red-700 to-red-600 hover:to-red-700'
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    xs: 'h-7 rounded-md px-3',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-12 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', fullWidth = false, ...props }, ref) => {
    return (
      <button
        className={getButtonClasses(variant, size, fullWidth, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };