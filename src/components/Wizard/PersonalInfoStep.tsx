import FormField from '../UI/FormField';
import type { PersonalInfo } from '../../cv/schema';
import { validatePersonalInfo } from '../../cv/validation';
import type { EditorProps } from './types';

const PersonalInfoStep = ({ value: info, onChange }: EditorProps<PersonalInfo>) => {
  const errors = validatePersonalInfo(info);
  const set = (field: keyof PersonalInfo) => (next: string) => onChange({ ...info, [field]: next });

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2 tabIndex={-1}>Your details</h2>
        <p>This appears at the top of your CV. Keep it short and make it easy to contact you.</p>
      </div>

      <div className="form-grid">
        <FormField
          label="Full name"
          value={info.fullName}
          onChange={set('fullName')}
          placeholder="e.g. Sebastian Bennett"
          required
          autoComplete="name"
          error={errors.fullName}
        />
        <FormField
          label="Professional title"
          value={info.professionalTitle}
          onChange={set('professionalTitle')}
          placeholder="e.g. Accountant"
          autoComplete="organization-title"
          optional
        />
      </div>

      <div className="form-grid">
        <FormField
          label="Email"
          value={info.email}
          onChange={set('email')}
          type="email"
          inputMode="email"
          placeholder="e.g. hello@email.com"
          required
          autoComplete="email"
          error={errors.email}
        />
        <FormField
          label="Phone"
          value={info.phone}
          onChange={set('phone')}
          type="tel"
          inputMode="tel"
          placeholder="e.g. +27 82 123 4567"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>

      <div className="form-grid">
        <FormField
          label="City"
          value={info.city}
          onChange={set('city')}
          placeholder="e.g. Cape Town"
          autoComplete="address-level2"
        />
        <FormField
          label="Country"
          value={info.country}
          onChange={set('country')}
          placeholder="e.g. South Africa"
          autoComplete="country-name"
        />
      </div>

      <FormField
        label="LinkedIn or website"
        value={info.linkedinUrl}
        onChange={set('linkedinUrl')}
        type="url"
        inputMode="url"
        placeholder="linkedin.com/in/yourprofile"
        autoComplete="url"
        optional
        error={errors.linkedinUrl}
      />
    </div>
  );
};

export default PersonalInfoStep;
