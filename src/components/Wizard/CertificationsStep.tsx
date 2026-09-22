import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { Achievement, Certification, Language, Reference, VolunteerExperience } from '../../types/cv';
import { generateId } from '../../utils/helpers';

interface CertificationsStepProps {
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  volunteerExperience: VolunteerExperience[];
  references: Reference[];
  includeReferences: boolean;
  onCertificationsChange: (data: Certification[]) => void;
  onLanguagesChange: (data: Language[]) => void;
  onAchievementsChange: (data: Achievement[]) => void;
  onVolunteerChange: (data: VolunteerExperience[]) => void;
  onReferencesChange: (data: Reference[]) => void;
  onIncludeReferencesChange: (value: boolean) => void;
}

const CertificationsStep: React.FC<CertificationsStepProps> = ({
  certifications,
  languages,
  achievements,
  volunteerExperience,
  references,
  includeReferences,
  onCertificationsChange,
  onLanguagesChange,
  onAchievementsChange,
  onVolunteerChange,
  onReferencesChange,
  onIncludeReferencesChange,
}) => {
  const [activeTab, setActiveTab] = useState<'certs' | 'langs' | 'achievements' | 'volunteer' | 'refs'>('certs');

  const tabs = [
    { key: 'certs' as const, label: 'Certifications', count: certifications.length },
    { key: 'langs' as const, label: 'Languages', count: languages.length },
    { key: 'achievements' as const, label: 'Awards', count: achievements.length },
    { key: 'volunteer' as const, label: 'Volunteer', count: volunteerExperience.length },
    { key: 'refs' as const, label: 'References', count: references.length },
  ];

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Additional Sections</h2>
        <p>Add certifications, languages, awards, volunteer work, and references.</p>
      </div>

      <div className="sub-tabs">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" className={`sub-tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label} {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'certs' && (
        <div className="tab-content">
          {certifications.map((cert) => (
            <div key={cert.id} className="compact-card">
              <div className="compact-card-header">
                <button type="button" className="btn-icon btn-delete" onClick={() => onCertificationsChange(certifications.filter((item) => item.id !== cert.id))}>×</button>
              </div>
              <div className="form-grid">
                <FormField label="Certification Name" value={cert.name} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, name: v } : item))} placeholder="e.g. Microsoft Azure Fundamentals" />
                <FormField label="Issuing Organization" value={cert.organization} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, organization: v } : item))} placeholder="e.g. Microsoft" />
              </div>
              <div className="form-grid form-grid-3">
                <FormField label="Date Obtained" value={cert.dateObtained} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, dateObtained: v } : item))} type="month" />
                <FormField label="Expiration Date" value={cert.expirationDate} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, expirationDate: v } : item))} type="month" optional />
                <FormField label="Credential ID" value={cert.credentialId} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, credentialId: v } : item))} placeholder="Optional" optional />
              </div>
              <FormField label="Credential URL" value={cert.credentialUrl} onChange={(v) => onCertificationsChange(certifications.map((item) => item.id === cert.id ? { ...item, credentialUrl: v } : item))} placeholder="Optional" optional />
            </div>
          ))}
          <button type="button" className="btn-add-section" onClick={() => onCertificationsChange([...certifications, { id: generateId(), name: '', organization: '', dateObtained: '', expirationDate: '', credentialId: '', credentialUrl: '' }])}>
            <span className="plus-icon">+</span> Add Certification
          </button>
        </div>
      )}

      {activeTab === 'langs' && (
        <div className="tab-content">
          {languages.map((lang) => (
            <div key={lang.id} className="language-row">
              <input className="form-input" value={lang.language} onChange={(e) => onLanguagesChange(languages.map((item) => item.id === lang.id ? { ...item, language: e.target.value } : item))} placeholder="e.g. English" />
              <select className="form-input" value={lang.level} onChange={(e) => onLanguagesChange(languages.map((item) => item.id === lang.id ? { ...item, level: e.target.value as Language['level'] } : item))}>
                <option value="native">Native</option>
                <option value="fluent">Fluent</option>
                <option value="professional">Professional</option>
                <option value="intermediate">Intermediate</option>
                <option value="basic">Basic</option>
              </select>
              <button type="button" className="btn-icon btn-delete" onClick={() => onLanguagesChange(languages.filter((item) => item.id !== lang.id))}>×</button>
            </div>
          ))}
          <button type="button" className="btn-add-section" onClick={() => onLanguagesChange([...languages, { id: generateId(), language: '', level: 'intermediate' }])}>
            <span className="plus-icon">+</span> Add Language
          </button>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="tab-content">
          {achievements.map((ach) => (
            <div key={ach.id} className="compact-card">
              <div className="compact-card-header">
                <button type="button" className="btn-icon btn-delete" onClick={() => onAchievementsChange(achievements.filter((item) => item.id !== ach.id))}>×</button>
              </div>
              <div className="form-grid">
                <FormField label="Achievement / Award" value={ach.title} onChange={(v) => onAchievementsChange(achievements.map((item) => item.id === ach.id ? { ...item, title: v } : item))} placeholder="e.g. Employee of the Year" />
                <FormField label="Organization" value={ach.organization} onChange={(v) => onAchievementsChange(achievements.map((item) => item.id === ach.id ? { ...item, organization: v } : item))} placeholder="e.g. Company Name" />
              </div>
              <div className="form-grid">
                <FormField label="Date" value={ach.date} onChange={(v) => onAchievementsChange(achievements.map((item) => item.id === ach.id ? { ...item, date: v } : item))} type="month" />
                <FormField label="Description" value={ach.description} onChange={(v) => onAchievementsChange(achievements.map((item) => item.id === ach.id ? { ...item, description: v } : item))} placeholder="Brief description" optional />
              </div>
            </div>
          ))}
          <button type="button" className="btn-add-section" onClick={() => onAchievementsChange([...achievements, { id: generateId(), title: '', organization: '', date: '', description: '' }])}>
            <span className="plus-icon">+</span> Add Achievement
          </button>
        </div>
      )}

      {activeTab === 'volunteer' && (
        <div className="tab-content">
          {volunteerExperience.map((vol) => (
            <div key={vol.id} className="compact-card">
              <div className="compact-card-header">
                <button type="button" className="btn-icon btn-delete" onClick={() => onVolunteerChange(volunteerExperience.filter((item) => item.id !== vol.id))}>×</button>
              </div>
              <div className="form-grid">
                <FormField label="Organization" value={vol.organization} onChange={(v) => onVolunteerChange(volunteerExperience.map((item) => item.id === vol.id ? { ...item, organization: v } : item))} placeholder="e.g. Red Cross" />
                <FormField label="Role" value={vol.role} onChange={(v) => onVolunteerChange(volunteerExperience.map((item) => item.id === vol.id ? { ...item, role: v } : item))} placeholder="e.g. Volunteer Coordinator" />
              </div>
              <div className="form-grid">
                <FormField label="Start Date" value={vol.startDate} onChange={(v) => onVolunteerChange(volunteerExperience.map((item) => item.id === vol.id ? { ...item, startDate: v } : item))} type="month" />
                <FormField label="End Date" value={vol.endDate} onChange={(v) => onVolunteerChange(volunteerExperience.map((item) => item.id === vol.id ? { ...item, endDate: v } : item))} type="month" />
              </div>
              <FormField
                label="Responsibilities"
                value={vol.responsibilities.join('\n')}
                onChange={(v) => onVolunteerChange(volunteerExperience.map((item) => item.id === vol.id ? { ...item, responsibilities: v.split('\n') } : item))}
                multiline
                rows={3}
                placeholder="One responsibility per line"
              />
            </div>
          ))}
          <button type="button" className="btn-add-section" onClick={() => onVolunteerChange([...volunteerExperience, { id: generateId(), organization: '', role: '', startDate: '', endDate: '', responsibilities: [''], achievements: [''] }])}>
            <span className="plus-icon">+</span> Add Volunteer Experience
          </button>
        </div>
      )}

      {activeTab === 'refs' && (
        <div className="tab-content">
          <div className="reference-toggle">
            <label className="checkbox-label">
              <input type="checkbox" checked={includeReferences} onChange={(e) => onIncludeReferencesChange(e.target.checked)} />
              Include references on my CV
            </label>
          </div>
          {includeReferences ? (
            <>
              {references.map((ref) => (
                <div key={ref.id} className="compact-card">
                  <div className="compact-card-header">
                    <button type="button" className="btn-icon btn-delete" onClick={() => onReferencesChange(references.filter((item) => item.id !== ref.id))}>×</button>
                  </div>
                  <div className="form-grid form-grid-3">
                    <FormField label="Name" value={ref.name} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, name: v } : item))} placeholder="e.g. John Smith" />
                    <FormField label="Position" value={ref.position} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, position: v } : item))} placeholder="e.g. Senior Manager" />
                    <FormField label="Company" value={ref.company} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, company: v } : item))} placeholder="e.g. Google" />
                  </div>
                  <div className="form-grid form-grid-3">
                    <FormField label="Phone" value={ref.phone} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, phone: v } : item))} placeholder="e.g. +27 123 456 789" />
                    <FormField label="Email" value={ref.email} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, email: v } : item))} placeholder="e.g. john@company.com" />
                    <FormField label="Relationship" value={ref.relationship} onChange={(v) => onReferencesChange(references.map((item) => item.id === ref.id ? { ...item, relationship: v } : item))} placeholder="e.g. Direct Manager" />
                  </div>
                </div>
              ))}
              <button type="button" className="btn-add-section" onClick={() => onReferencesChange([...references, { id: generateId(), name: '', position: '', company: '', phone: '', email: '', relationship: '' }])}>
                <span className="plus-icon">+</span> Add Reference
              </button>
            </>
          ) : (
            <div className="reference-note">
              <p>Your CV will display: <em>References available upon request</em></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationsStep;
