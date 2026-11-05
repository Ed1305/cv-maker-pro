import { SECTION_IDS, type CVData, type SectionId } from '../../cv/schema';
import { SECTION_META } from '../../cv/sections';
import { createId } from '../../cv/id';
import { SECTION_UI, type PatchCv } from '../../sections/registry';
import { ArrowDownIcon, ArrowUpIcon } from '../UI/icons';
import { moveItem } from './types';

interface SectionsStepProps {
  data: CVData;
  patch: PatchCv;
  editing: SectionId | null;
  onEdit: (id: SectionId | null) => void;
}

const SectionsStep = ({ data, patch, editing, onEdit }: SectionsStepProps) => {
  const enabled = data.enabledSections;

  const enable = (id: SectionId) => {
    const updates: Partial<CVData> = { enabledSections: enabled.includes(id) ? enabled : [...enabled, id] };
    if (id === 'custom' && data.customSections.length === 0) {
      updates.customSections = [{ id: createId(), title: '', content: '' }];
    }
    patch(updates);
    onEdit(id);
  };

  const remove = (id: SectionId) => {
    patch(
      { enabledSections: enabled.filter((section) => section !== id) },
      `Removed ${SECTION_META[id].title} from your CV`,
    );
    if (editing === id) onEdit(null);
  };

  if (editing) {
    const meta = SECTION_META[editing];
    return (
      <div className="wizard-step">
        <button type="button" className="btn-back-sections" onClick={() => onEdit(null)}>
          ← All sections
        </button>
        <div className="step-header">
          <h2 tabIndex={-1}>{meta.title}</h2>
          <p>{meta.intro}</p>
        </div>
        {SECTION_UI[editing].renderEditor(data, patch)}
      </div>
    );
  }

  const available = SECTION_IDS.filter((id) => !enabled.includes(id));

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2 tabIndex={-1}>Sections</h2>
        <p>Add only the sections you need, and put the most relevant first. The preview updates as you go.</p>
      </div>

      {enabled.length > 0 && (
        <div className="added-sections">
          <h3 id="added-sections-heading">On your CV (in this order)</h3>
          <ol className="added-section-list" aria-labelledby="added-sections-heading">
            {enabled.map((id, index) => {
              const title = SECTION_META[id].title;
              const empty = SECTION_META[id].isEmpty(data);
              return (
                <li key={id} className="added-section-row">
                  <span className="added-section-icon">{SECTION_UI[id].icon}</span>
                  <span className="added-section-name">
                    {title}
                    {empty && <span className="badge-warning">Empty</span>}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    disabled={index === 0}
                    aria-label={`Move ${title} up`}
                    title="Move up"
                    onClick={() => patch({ enabledSections: moveItem(enabled, index, -1) })}
                  >
                    <ArrowUpIcon />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    disabled={index === enabled.length - 1}
                    aria-label={`Move ${title} down`}
                    title="Move down"
                    onClick={() => patch({ enabledSections: moveItem(enabled, index, 1) })}
                  >
                    <ArrowDownIcon />
                  </button>
                  <button type="button" className="btn-text" aria-label={`Edit ${title}`} onClick={() => onEdit(id)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-text btn-remove-section"
                    aria-label={`Remove ${title}`}
                    onClick={() => remove(id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {available.length > 0 && (
        <>
          <h3 className="section-options-heading">{enabled.length > 0 ? 'Add more' : 'Choose sections'}</h3>
          <div className="section-options-grid">
            {available.map((id) => (
              <button
                key={id}
                type="button"
                className={`section-option-card${id === 'custom' ? ' is-custom' : ''}`}
                onClick={() => enable(id)}
              >
                <span className="section-option-icon">{SECTION_UI[id].icon}</span>
                <span className="section-option-title">{SECTION_META[id].title}</span>
                <span className="section-option-desc">{SECTION_META[id].description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionsStep;
