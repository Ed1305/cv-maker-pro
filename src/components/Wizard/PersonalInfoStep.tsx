import React from 'react';
import FormField from '../UI/FormField';
import { PersonalInfo } from '../../types/cv';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  const update = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...data, [field]: value };
    if (field === 'fullName') {
      const parts = value.trim().split(/\s+/);
      updated.firstName = parts[0] || '';
      updated.lastName = parts.slice(1).join(' ') || '';
    }
    onChange(updated);
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Your details</h2>
        <p>This appears at the top of your CV. Keep it short and easy to contact you.</p>
      </div>

      <div className="form-grid">
        <FormField label="Full name" value={data.fullName} onChange={(v) => update('fullName', v)} placeholder="e.g. Sebastian Bennett" required />
        <FormField label="Professional title" value={data.professionalTitle} onChange={(v) => update('professionalTitle', v)} placeholder="e.g. Professional Accountant" required />
      </div>

      <div className="form-grid">
        <FormField label="Email" value={data.email} onChange={(v) => update('email', v)} type="email" placeholder="e.g. hello@email.com" required />
        <FormField label="Phone" value={data.phone} onChange={(v) => update('phone', v)} type="tel" placeholder="e.g. +1 234 567 890" required />
      </div>

      <div className="form-grid">
        <FormField label="City" value={data.city} onChange={(v) => update('city', v)} placeholder="e.g. Any City" />
        <FormField label="Country" value={data.country} onChange={(v) => update('country', v)} placeholder="e.g. Any Country" />
      </div>

      <FormField label="LinkedIn or website" value={data.linkedinUrl} onChange={(v) => update('linkedinUrl', v)} placeholder="https://linkedin.com/in/yourprofile" optional />
    </div>
  );
};

export default PersonalInfoStep;
