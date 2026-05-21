import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all text-gray-900 bg-white p-3 placeholder-gray-400',
            error ? 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600 font-bold">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500 font-medium">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
