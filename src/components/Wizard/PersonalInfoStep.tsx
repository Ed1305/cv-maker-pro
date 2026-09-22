import React, { useRef } from 'react';
import FormField from '../UI/FormField';
import { PersonalInfo } from '../../types/cv';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...data, [field]: value };
    if (field === 'fullName') {
      const parts = value.trim().split(/\s+/);
      updated.firstName = parts[0] || '';
      updated.lastName = parts.slice(1).join(' ') || '';
    }
    onChange(updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => update('photoUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Let's start with your details</h2>
        <p>This information appears at the top of your CV. Only add what you want employers to see.</p>
      </div>

      <div className="photo-upload-section">
        <div className="photo-preview" onClick={() => fileInputRef.current?.click()}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt="Profile" />
          ) : (
            <div className="photo-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Add Photo</span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
        {data.photoUrl && (
          <button type="button" className="btn-text btn-remove-photo" onClick={() => update('photoUrl', '')}>
            Remove Photo
          </button>
        )}
      </div>

      <div className="form-grid">
        <FormField label="What's your full name?" value={data.fullName} onChange={(v) => update('fullName', v)} placeholder="e.g. Eden Kabamba" required />
        <FormField label="What job title best describes you?" value={data.professionalTitle} onChange={(v) => update('professionalTitle', v)} placeholder="e.g. Systems Developer" required />
      </div>

      <div className="form-grid">
        <FormField label="Email Address" value={data.email} onChange={(v) => update('email', v)} type="email" placeholder="e.g. eden@example.com" required />
        <FormField label="Phone Number" value={data.phone} onChange={(v) => update('phone', v)} type="tel" placeholder="e.g. +27 123 456 789" required />
      </div>

      <div className="form-grid form-grid-3">
        <FormField label="City" value={data.city} onChange={(v) => update('city', v)} placeholder="e.g. Cape Town" />
        <FormField label="Country" value={data.country} onChange={(v) => update('country', v)} placeholder="e.g. South Africa" />
        <FormField label="Address" value={data.address} onChange={(v) => update('address', v)} placeholder="e.g. 123 Main Street" optional />
      </div>

      <div className="form-section-divider">
        <h3>Online Profiles</h3>
      </div>

      <div className="form-grid">
        <FormField label="LinkedIn URL" value={data.linkedinUrl} onChange={(v) => update('linkedinUrl', v)} placeholder="https://linkedin.com/in/yourprofile" optional />
        <FormField label="Portfolio / Website" value={data.portfolioUrl} onChange={(v) => update('portfolioUrl', v)} placeholder="https://yourwebsite.com" optional />
      </div>

      <div className="form-grid">
        <FormField label="GitHub URL" value={data.githubUrl} onChange={(v) => update('githubUrl', v)} placeholder="https://github.com/yourusername" optional />
        <FormField label="Twitter / X" value={data.twitterUrl} onChange={(v) => update('twitterUrl', v)} placeholder="https://twitter.com/yourhandle" optional />
      </div>

      <div className="form-section-divider">
        <h3>Additional Info</h3>
      </div>

      <div className="form-grid">
        <FormField label="Date of Birth" value={data.dateOfBirth} onChange={(v) => update('dateOfBirth', v)} type="date" optional />
        <FormField label="Nationality" value={data.nationality} onChange={(v) => update('nationality', v)} placeholder="e.g. South African" optional />
      </div>
    </div>
  );
};

export default PersonalInfoStep;
