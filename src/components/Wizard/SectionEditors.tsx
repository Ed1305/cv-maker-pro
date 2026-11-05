import { useState, type ReactNode } from 'react';
import FormField from '../UI/FormField';
import { CloseIcon, TrashIcon } from '../UI/icons';
import { createId } from '../../cv/id';
import {
  LANGUAGE_LEVELS,
  type Achievement,
  type Certification,
  type Course,
  type CustomSection,
  type Interest,
  type Language,
  type Publication,
  type Reference,
  type VolunteerExperience,
} from '../../cv/schema';
import { isValidEmail, isValidUrl } from '../../cv/validation';
import { type Change, type EditorProps, replaceById } from './types';

interface CompactCardProps {
  label: string;
  onRemove: () => void;
  children: ReactNode;
}

const CompactCard = ({ label, onRemove, children }: CompactCardProps) => (
  <div className="compact-card">
    <button
      type="button"
      className="btn-icon btn-delete compact-card-remove"
      onClick={onRemove}
      aria-label={`Delete ${label}`}
      title="Delete"
    >
      <TrashIcon />
    </button>
    {children}
  </div>
);

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" className="btn-add-section" onClick={onClick}>
    <span className="plus-icon" aria-hidden="true">
      +
    </span>{' '}
    {label}
  </button>
);

/** Generic helpers for editors whose items are flat objects with an id. */
const useList = <T extends { id: string }>(list: T[], onChange: Change<T[]>, noun: string) => ({
  update: (id: string, patch: Partial<T>) => onChange(replaceById(list, id, patch)),
  remove: (item: T, name: string) =>
    onChange(
      list.filter((entry) => entry.id !== item.id),
      `Deleted ${name ? `"${name}"` : noun}`,
    ),
  add: (item: T) => onChange([...list, item]),
});

const urlError = (value: string) => (value.trim() && !isValidUrl(value) ? 'Enter a web address.' : undefined);

export const LanguagesEditor = ({ value: list, onChange }: EditorProps<Language[]>) => {
  const { update, remove, add } = useList(list, onChange, 'language');
  return (
    <div className="tab-content">
      {list.map((lang, index) => (
        <div key={lang.id} className="language-row">
          <input
            className="form-input"
            aria-label={`Language ${index + 1}`}
            value={lang.language}
            onChange={(e) => update(lang.id, { language: e.target.value })}
            placeholder="e.g. English"
          />
          <select
            className="form-input"
            aria-label={`${lang.language || `Language ${index + 1}`} level`}
            value={lang.level}
            onChange={(e) => update(lang.id, { level: e.target.value as Language['level'] })}
          >
            {LANGUAGE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-icon btn-delete"
            aria-label={`Delete ${lang.language || 'language'}`}
            onClick={() => remove(lang, lang.language)}
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <AddButton label="Add language" onClick={() => add({ id: createId(), language: '', level: 'intermediate' })} />
    </div>
  );
};

export const CertificatesEditor = ({ value: list, onChange }: EditorProps<Certification[]>) => {
  const { update, remove, add } = useList(list, onChange, 'certificate');
  return (
    <div className="tab-content">
      {list.map((cert) => (
        <CompactCard key={cert.id} label={cert.name || 'certificate'} onRemove={() => remove(cert, cert.name)}>
          <div className="form-grid">
            <FormField
              label="Certificate name"
              value={cert.name}
              onChange={(v) => update(cert.id, { name: v })}
              placeholder="e.g. Microsoft Azure Fundamentals"
            />
            <FormField
              label="Issuing organisation"
              value={cert.organization}
              onChange={(v) => update(cert.id, { organization: v })}
              placeholder="e.g. Microsoft"
            />
          </div>
          <div className="form-grid">
            <FormField
              label="Date obtained"
              value={cert.dateObtained}
              onChange={(v) => update(cert.id, { dateObtained: v })}
              type="month"
            />
            <FormField
              label="Expiry date"
              value={cert.expirationDate}
              onChange={(v) => update(cert.id, { expirationDate: v })}
              type="month"
              optional
            />
          </div>
        </CompactCard>
      ))}
      <AddButton
        label="Add certificate"
        onClick={() => add({ id: createId(), name: '', organization: '', dateObtained: '', expirationDate: '' })}
      />
    </div>
  );
};

export const InterestsEditor = ({ value: list, onChange }: EditorProps<Interest[]>) => {
  const [draft, setDraft] = useState('');
  const { remove, add } = useList(list, onChange, 'interest');

  const submit = () => {
    if (!draft.trim()) return;
    add({ id: createId(), name: draft.trim() });
    setDraft('');
  };

  return (
    <div className="tab-content">
      {list.length > 0 && (
        <ul className="skills-tags">
          {list.map((item) => (
            <li key={item.id} className="skill-tag">
              <span className="skill-name">{item.name}</span>
              <button
                type="button"
                className="skill-remove"
                aria-label={`Remove ${item.name}`}
                onClick={() => remove(item, item.name)}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="inline-add">
        <input
          className="form-input"
          aria-label="Add an interest"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. Photography"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button type="button" className="btn-primary btn-sm" onClick={submit} disabled={!draft.trim()}>
          + Add
        </button>
      </div>
    </div>
  );
};

export const CoursesEditor = ({ value: list, onChange }: EditorProps<Course[]>) => {
  const { update, remove, add } = useList(list, onChange, 'course');
  return (
    <div className="tab-content">
      {list.map((course) => (
        <CompactCard key={course.id} label={course.name || 'course'} onRemove={() => remove(course, course.name)}>
          <div className="form-grid form-grid-3">
            <FormField
              label="Course name"
              value={course.name}
              onChange={(v) => update(course.id, { name: v })}
              placeholder="e.g. Financial Accounting"
            />
            <FormField
              label="Provider"
              value={course.organization}
              onChange={(v) => update(course.id, { organization: v })}
              placeholder="e.g. Coursera"
            />
            <FormField label="Date" value={course.date} onChange={(v) => update(course.id, { date: v })} type="month" />
          </div>
        </CompactCard>
      ))}
      <AddButton label="Add course" onClick={() => add({ id: createId(), name: '', organization: '', date: '' })} />
    </div>
  );
};

export const AwardsEditor = ({ value: list, onChange }: EditorProps<Achievement[]>) => {
  const { update, remove, add } = useList(list, onChange, 'award');
  return (
    <div className="tab-content">
      {list.map((award) => (
        <CompactCard key={award.id} label={award.title || 'award'} onRemove={() => remove(award, award.title)}>
          <div className="form-grid">
            <FormField
              label="Award"
              value={award.title}
              onChange={(v) => update(award.id, { title: v })}
              placeholder="e.g. Employee of the Year"
            />
            <FormField
              label="Awarded by"
              value={award.organization}
              onChange={(v) => update(award.id, { organization: v })}
              placeholder="e.g. Acme Ltd"
            />
          </div>
          <div className="form-grid">
            <FormField label="Date" value={award.date} onChange={(v) => update(award.id, { date: v })} type="month" />
            <FormField
              label="Description"
              value={award.description}
              onChange={(v) => update(award.id, { description: v })}
              placeholder="Brief description"
              optional
            />
          </div>
        </CompactCard>
      ))}
      <AddButton
        label="Add award"
        onClick={() => add({ id: createId(), title: '', organization: '', date: '', description: '' })}
      />
    </div>
  );
};

export const OrganisationsEditor = ({ value: list, onChange }: EditorProps<VolunteerExperience[]>) => {
  const { update, remove, add } = useList(list, onChange, 'organisation');
  return (
    <div className="tab-content">
      {list.map((org) => (
        <CompactCard
          key={org.id}
          label={org.organization || 'organisation'}
          onRemove={() => remove(org, org.organization)}
        >
          <div className="form-grid">
            <FormField
              label="Organisation"
              value={org.organization}
              onChange={(v) => update(org.id, { organization: v })}
              placeholder="e.g. Red Cross"
            />
            <FormField
              label="Role"
              value={org.role}
              onChange={(v) => update(org.id, { role: v })}
              placeholder="e.g. Volunteer coordinator"
            />
          </div>
          <div className="form-grid">
            <FormField
              label="Start date"
              value={org.startDate}
              onChange={(v) => update(org.id, { startDate: v })}
              type="month"
            />
            <FormField
              label="End date"
              value={org.endDate}
              onChange={(v) => update(org.id, { endDate: v })}
              type="month"
              optional
            />
          </div>
          <FormField
            label="What did you do?"
            value={org.responsibilities.join('\n')}
            onChange={(v) => update(org.id, { responsibilities: v.split('\n') })}
            multiline
            rows={3}
            helperText="One point per line."
          />
        </CompactCard>
      ))}
      <AddButton
        label="Add organisation"
        onClick={() =>
          add({ id: createId(), organization: '', role: '', startDate: '', endDate: '', responsibilities: [] })
        }
      />
    </div>
  );
};

export const PublicationsEditor = ({ value: list, onChange }: EditorProps<Publication[]>) => {
  const { update, remove, add } = useList(list, onChange, 'publication');
  return (
    <div className="tab-content">
      {list.map((pub) => (
        <CompactCard key={pub.id} label={pub.title || 'publication'} onRemove={() => remove(pub, pub.title)}>
          <FormField
            label="Title"
            value={pub.title}
            onChange={(v) => update(pub.id, { title: v })}
            placeholder="e.g. Improving Financial Reporting"
          />
          <div className="form-grid">
            <FormField
              label="Publisher"
              value={pub.publisher}
              onChange={(v) => update(pub.id, { publisher: v })}
              placeholder="e.g. Journal name"
            />
            <FormField label="Date" value={pub.date} onChange={(v) => update(pub.id, { date: v })} type="month" />
          </div>
          <FormField
            label="Link"
            value={pub.url}
            onChange={(v) => update(pub.id, { url: v })}
            placeholder="https://"
            type="url"
            inputMode="url"
            optional
            error={urlError(pub.url)}
          />
        </CompactCard>
      ))}
      <AddButton
        label="Add publication"
        onClick={() => add({ id: createId(), title: '', publisher: '', date: '', url: '' })}
      />
    </div>
  );
};

interface ReferencesEditorProps extends EditorProps<Reference[]> {
  includeReferences: boolean;
  onIncludeChange: (value: boolean) => void;
}

export const ReferencesEditor = ({
  value: list,
  onChange,
  includeReferences,
  onIncludeChange,
}: ReferencesEditorProps) => {
  const { update, remove, add } = useList(list, onChange, 'reference');
  return (
    <div className="tab-content">
      <div className="reference-toggle">
        <label className="checkbox-label">
          <input type="checkbox" checked={includeReferences} onChange={(e) => onIncludeChange(e.target.checked)} />
          Show reference contact details on my CV
        </label>
      </div>
      {includeReferences ? (
        <>
          {list.map((ref) => (
            <CompactCard key={ref.id} label={ref.name || 'reference'} onRemove={() => remove(ref, ref.name)}>
              <div className="form-grid form-grid-3">
                <FormField
                  label="Name"
                  value={ref.name}
                  onChange={(v) => update(ref.id, { name: v })}
                  placeholder="e.g. Jane Smith"
                />
                <FormField
                  label="Position"
                  value={ref.position}
                  onChange={(v) => update(ref.id, { position: v })}
                  placeholder="e.g. Senior Manager"
                />
                <FormField
                  label="Company"
                  value={ref.company}
                  onChange={(v) => update(ref.id, { company: v })}
                  placeholder="e.g. Acme Ltd"
                />
              </div>
              <div className="form-grid">
                <FormField
                  label="Phone"
                  value={ref.phone}
                  onChange={(v) => update(ref.id, { phone: v })}
                  type="tel"
                  placeholder="e.g. +27 21 123 4567"
                />
                <FormField
                  label="Email"
                  value={ref.email}
                  onChange={(v) => update(ref.id, { email: v })}
                  type="email"
                  placeholder="e.g. jane@company.com"
                  error={
                    ref.email.trim() && !isValidEmail(ref.email) ? 'This email address looks incomplete.' : undefined
                  }
                />
              </div>
            </CompactCard>
          ))}
          <AddButton
            label="Add reference"
            onClick={() => add({ id: createId(), name: '', position: '', company: '', phone: '', email: '' })}
          />
        </>
      ) : (
        <div className="reference-note">
          <p>
            Your CV will say: <em>References available upon request.</em>
          </p>
        </div>
      )}
    </div>
  );
};

export const DeclarationEditor = ({ value, onChange }: EditorProps<string>) => (
  <FormField
    label="Declaration"
    value={value}
    onChange={(v) => onChange(v)}
    multiline
    rows={5}
    placeholder="I hereby declare that the information provided is true and correct to the best of my knowledge."
  />
);

export const CustomEditor = ({ value: list, onChange }: EditorProps<CustomSection[]>) => {
  const { update, remove, add } = useList(list, onChange, 'section');
  return (
    <div className="tab-content">
      {list.map((section) => (
        <CompactCard
          key={section.id}
          label={section.title || 'custom section'}
          onRemove={() => remove(section, section.title)}
        >
          <FormField
            label="Section heading"
            value={section.title}
            onChange={(v) => update(section.id, { title: v })}
            placeholder="e.g. Volunteering"
          />
          <FormField
            label="Content"
            value={section.content}
            onChange={(v) => update(section.id, { content: v })}
            multiline
            rows={4}
            placeholder="Write this section in your own words."
          />
        </CompactCard>
      ))}
      <AddButton label="Add custom section" onClick={() => add({ id: createId(), title: '', content: '' })} />
    </div>
  );
};
