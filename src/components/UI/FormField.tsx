import { useId, useState, type HTMLInputTypeAttribute } from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  /** Validation message. Shown once the user has left the field (or immediately if `showError`). */
  error?: string;
  showError?: boolean;
  /** Keep the label for screen readers but don't show it. */
  hideLabel?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric';
}

const FormField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  optional = false,
  multiline = false,
  rows = 3,
  helperText,
  error,
  showError = false,
  hideLabel = false,
  autoComplete,
  inputMode,
}: FormFieldProps) => {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const visibleError = error && (touched || showError) ? error : undefined;
  const describedBy =
    [visibleError && `${id}-error`, helperText && `${id}-help`].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    className: `form-input${multiline ? ' form-textarea' : ''}${visibleError ? ' has-error' : ''}`,
    value,
    placeholder,
    required,
    'aria-invalid': visibleError ? true : undefined,
    'aria-describedby': describedBy,
    onBlur: () => setTouched(true),
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : 'form-label'}>
        {label}
        {optional && <span className="optional-badge">Optional</span>}
        {required && (
          <span className="required-star" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {multiline ? (
        <textarea {...shared} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {helperText && (
        <span id={`${id}-help`} className="helper-text">
          {helperText}
        </span>
      )}
      {visibleError && (
        <span id={`${id}-error`} className="field-error">
          {visibleError}
        </span>
      )}
    </div>
  );
};

export default FormField;
