// frontend/src/components/common/Forms/FormField.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  error,
  hint,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
      </div>

      {error && (
        <div className="flex items-center mt-1">
          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default FormField; 
