import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`h-4 w-4 rounded border-text-300 text-primary-600 focus:ring-indigo-500 ${className}`}
          ref={ref}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="ml-2 block text-sm text-text-900"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };