import React, { useState } from 'react';
import FormField from '../UI/FormField';
import {
  Achievement,
  Certification,
  Course,
  CustomSection,
  Interest,
  Language,
  Publication,
  Reference,
  VolunteerExperience,
} from '../../types/cv';
import { generateId } from '../../utils/helpers';

const emptyCard = (key: string, onRemove: () => void, children: React.ReactNode) => (
  <div key={key} className="compact-card">
    <div className="compact-card-header">
      <button type="button" className="btn-icon btn-delete" onClick={onRemove}>×</button>
    </div>
    {children}
  </div>
);

export const LanguagesEditor: React.FC<{ data: Language[]; onChange: (data: Language[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((lang) => (
      <div key={lang.id} className="language-row">
        <input className="form-input" value={lang.language} onChange={(e) => onChange(data.map((item) => item.id === lang.id ? { ...item, language: e.target.value } : item))} placeholder="e.g. English" />
        <select className="form-input" value={lang.level} onChange={(e) => onChange(data.map((item) => item.id === lang.id ? { ...item, level: e.target.value as Language['level'] } : item))}>
          <option value="native">Native</option>
          <option value="fluent">Fluent</option>
          <option value="professional">Professional</option>
          <option value="intermediate">Intermediate</option>
          <option value="basic">Basic</option>
        </select>
        <button type="button" className="btn-icon btn-delete" onClick={() => onChange(data.filter((item) => item.id !== lang.id))}>×</button>
      </div>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), language: '', level: 'intermediate' }])}>
      <span className="plus-icon">+</span> Add Language
    </button>
  </div>
);

export const CertificatesEditor: React.FC<{ data: Certification[]; onChange: (data: Certification[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((cert) => emptyCard(
      cert.id,
      () => onChange(data.filter((item) => item.id !== cert.id)),
      <>
        <div className="form-grid">
          <FormField label="Certificate Name" value={cert.name} onChange={(v) => onChange(data.map((item) => item.id === cert.id ? { ...item, name: v } : item))} placeholder="e.g. Microsoft Azure Fundamentals" />
          <FormField label="Issuing Organization" value={cert.organization} onChange={(v) => onChange(data.map((item) => item.id === cert.id ? { ...item, organization: v } : item))} placeholder="e.g. Microsoft" />
        </div>
        <div className="form-grid">
          <FormField label="Date Obtained" value={cert.dateObtained} onChange={(v) => onChange(data.map((item) => item.id === cert.id ? { ...item, dateObtained: v } : item))} type="month" />
          <FormField label="Expiration Date" value={cert.expirationDate} onChange={(v) => onChange(data.map((item) => item.id === cert.id ? { ...item, expirationDate: v } : item))} type="month" optional />
        </div>
      </>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), name: '', organization: '', dateObtained: '', expirationDate: '', credentialId: '', credentialUrl: '' }])}>
      <span className="plus-icon">+</span> Add Certificate
    </button>
  </div>
);

export const InterestsEditor: React.FC<{ data: Interest[]; onChange: (data: Interest[]) => void }> = ({ data, onChange }) => {
  const [value, setValue] = useState('');

  const addInterest = () => {
    if (!value.trim()) return;
    onChange([...data, { id: generateId(), name: value.trim() }]);
    setValue('');
  };

  return (
    <div className="tab-content">
      <div className="skills-tags" style={{ marginBottom: 16 }}>
        {data.map((item) => (
          <div key={item.id} className="skill-tag">
            <span className="skill-name">{item.name}</span>
            <button type="button" className="skill-remove" onClick={() => onChange(data.filter((entry) => entry.id !== item.id))}>×</button>
          </div>
        ))}
      </div>
      <div className="add-custom-skill">
        <input className="form-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. Photography" onKeyDown={(e) => e.key === 'Enter' && addInterest()} />
        <button type="button" className="btn-primary btn-sm" onClick={addInterest}>+ Add</button>
      </div>
    </div>
  );
};

export const CoursesEditor: React.FC<{ data: Course[]; onChange: (data: Course[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((course) => emptyCard(
      course.id,
      () => onChange(data.filter((item) => item.id !== course.id)),
      <div className="form-grid form-grid-3">
        <FormField label="Course Name" value={course.name} onChange={(v) => onChange(data.map((item) => item.id === course.id ? { ...item, name: v } : item))} placeholder="e.g. Financial Accounting" />
        <FormField label="Provider" value={course.organization} onChange={(v) => onChange(data.map((item) => item.id === course.id ? { ...item, organization: v } : item))} placeholder="e.g. Coursera" />
        <FormField label="Date" value={course.date} onChange={(v) => onChange(data.map((item) => item.id === course.id ? { ...item, date: v } : item))} type="month" />
      </div>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), name: '', organization: '', date: '' }])}>
      <span className="plus-icon">+</span> Add Course
    </button>
  </div>
);

export const AwardsEditor: React.FC<{ data: Achievement[]; onChange: (data: Achievement[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((award) => emptyCard(
      award.id,
      () => onChange(data.filter((item) => item.id !== award.id)),
      <>
        <div className="form-grid">
          <FormField label="Award" value={award.title} onChange={(v) => onChange(data.map((item) => item.id === award.id ? { ...item, title: v } : item))} placeholder="e.g. Employee of the Year" />
          <FormField label="Organization" value={award.organization} onChange={(v) => onChange(data.map((item) => item.id === award.id ? { ...item, organization: v } : item))} placeholder="e.g. Company Name" />
        </div>
        <div className="form-grid">
          <FormField label="Date" value={award.date} onChange={(v) => onChange(data.map((item) => item.id === award.id ? { ...item, date: v } : item))} type="month" />
          <FormField label="Description" value={award.description} onChange={(v) => onChange(data.map((item) => item.id === award.id ? { ...item, description: v } : item))} placeholder="Brief description" optional />
        </div>
      </>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), title: '', organization: '', date: '', description: '' }])}>
      <span className="plus-icon">+</span> Add Award
    </button>
  </div>
);

export const OrganisationsEditor: React.FC<{ data: VolunteerExperience[]; onChange: (data: VolunteerExperience[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((org) => emptyCard(
      org.id,
      () => onChange(data.filter((item) => item.id !== org.id)),
      <>
        <div className="form-grid">
          <FormField label="Organisation" value={org.organization} onChange={(v) => onChange(data.map((item) => item.id === org.id ? { ...item, organization: v } : item))} placeholder="e.g. Red Cross" />
          <FormField label="Role" value={org.role} onChange={(v) => onChange(data.map((item) => item.id === org.id ? { ...item, role: v } : item))} placeholder="e.g. Volunteer Coordinator" />
        </div>
        <div className="form-grid">
          <FormField label="Start Date" value={org.startDate} onChange={(v) => onChange(data.map((item) => item.id === org.id ? { ...item, startDate: v } : item))} type="month" />
          <FormField label="End Date" value={org.endDate} onChange={(v) => onChange(data.map((item) => item.id === org.id ? { ...item, endDate: v } : item))} type="month" />
        </div>
        <FormField
          label="What did you do?"
          value={org.responsibilities.join('\n')}
          onChange={(v) => onChange(data.map((item) => item.id === org.id ? { ...item, responsibilities: v.split('\n') } : item))}
          multiline
          rows={3}
          placeholder="One point per line"
        />
      </>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), organization: '', role: '', startDate: '', endDate: '', responsibilities: [''], achievements: [''] }])}>
      <span className="plus-icon">+</span> Add Organisation
    </button>
  </div>
);

export const PublicationsEditor: React.FC<{ data: Publication[]; onChange: (data: Publication[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((pub) => emptyCard(
      pub.id,
      () => onChange(data.filter((item) => item.id !== pub.id)),
      <>
        <FormField label="Title" value={pub.title} onChange={(v) => onChange(data.map((item) => item.id === pub.id ? { ...item, title: v } : item))} placeholder="e.g. Improving Financial Reporting" />
        <div className="form-grid">
          <FormField label="Publisher" value={pub.publisher} onChange={(v) => onChange(data.map((item) => item.id === pub.id ? { ...item, publisher: v } : item))} placeholder="e.g. Journal Name" />
          <FormField label="Date" value={pub.date} onChange={(v) => onChange(data.map((item) => item.id === pub.id ? { ...item, date: v } : item))} type="month" />
        </div>
        <FormField label="URL" value={pub.url} onChange={(v) => onChange(data.map((item) => item.id === pub.id ? { ...item, url: v } : item))} placeholder="https://" optional />
      </>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), title: '', publisher: '', date: '', url: '' }])}>
      <span className="plus-icon">+</span> Add Publication
    </button>
  </div>
);

export const ReferencesEditor: React.FC<{
  data: Reference[];
  includeReferences: boolean;
  onChange: (data: Reference[]) => void;
  onIncludeChange: (value: boolean) => void;
}> = ({ data, includeReferences, onChange, onIncludeChange }) => (
  <div className="tab-content">
    <div className="reference-toggle">
      <label className="checkbox-label">
        <input type="checkbox" checked={includeReferences} onChange={(e) => onIncludeChange(e.target.checked)} />
        Include reference details on my CV
      </label>
    </div>
    {includeReferences ? (
      <>
        {data.map((ref) => emptyCard(
          ref.id,
          () => onChange(data.filter((item) => item.id !== ref.id)),
          <>
            <div className="form-grid form-grid-3">
              <FormField label="Name" value={ref.name} onChange={(v) => onChange(data.map((item) => item.id === ref.id ? { ...item, name: v } : item))} placeholder="e.g. John Smith" />
              <FormField label="Position" value={ref.position} onChange={(v) => onChange(data.map((item) => item.id === ref.id ? { ...item, position: v } : item))} placeholder="e.g. Senior Manager" />
              <FormField label="Company" value={ref.company} onChange={(v) => onChange(data.map((item) => item.id === ref.id ? { ...item, company: v } : item))} placeholder="e.g. Google" />
            </div>
            <div className="form-grid">
              <FormField label="Phone" value={ref.phone} onChange={(v) => onChange(data.map((item) => item.id === ref.id ? { ...item, phone: v } : item))} placeholder="e.g. +27 123 456 789" />
              <FormField label="Email" value={ref.email} onChange={(v) => onChange(data.map((item) => item.id === ref.id ? { ...item, email: v } : item))} placeholder="e.g. john@company.com" />
            </div>
          </>
        ))}
        <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), name: '', position: '', company: '', phone: '', email: '', relationship: '' }])}>
          <span className="plus-icon">+</span> Add Reference
        </button>
      </>
    ) : (
      <div className="reference-note">
        <p>Your CV will display: <em>References available upon request</em></p>
      </div>
    )}
  </div>
);

export const DeclarationEditor: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <FormField
    label="Declaration"
    value={value}
    onChange={onChange}
    multiline
    rows={5}
    placeholder="I hereby declare that the information provided is true and correct to the best of my knowledge."
  />
);

export const CustomEditor: React.FC<{ data: CustomSection[]; onChange: (data: CustomSection[]) => void }> = ({ data, onChange }) => (
  <div className="tab-content">
    {data.map((section) => emptyCard(
      section.id,
      () => onChange(data.filter((item) => item.id !== section.id)),
      <>
        <FormField label="Section Title" value={section.title} onChange={(v) => onChange(data.map((item) => item.id === section.id ? { ...item, title: v } : item))} placeholder="e.g. Hobbies" />
        <FormField label="Content" value={section.content} onChange={(v) => onChange(data.map((item) => item.id === section.id ? { ...item, content: v } : item))} multiline rows={4} placeholder="Write this section in your own words." />
      </>
    ))}
    <button type="button" className="btn-add-section" onClick={() => onChange([...data, { id: generateId(), title: '', content: '' }])}>
      <span className="plus-icon">+</span> Add Custom Section
    </button>
  </div>
);
