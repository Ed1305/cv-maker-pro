import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
  helperText?: string;
  optional?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  multiline = false,
  rows = 3,
  icon,
  helperText,
  optional = false,
}) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {icon && <span className="form-icon">{icon}</span>}
          {label}
          {optional && <span className="optional-badge">Optional</span>}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          className="form-input form-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

export default FormField;
