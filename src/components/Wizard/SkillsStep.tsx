import { useState } from 'react';
import { CloseIcon } from '../UI/icons';
import { createId } from '../../cv/id';
import { SKILL_LEVELS, type Skill } from '../../cv/schema';
import { SUGGESTED_SKILLS } from '../../cv/skills';
import type { EditorProps } from './types';

const CATEGORIES = Object.keys(SUGGESTED_SKILLS);

const SkillsStep = ({ value: skills, onChange }: EditorProps<Skill[]>) => {
  const [custom, setCustom] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const find = (name: string) => skills.find((skill) => skill.name.toLowerCase() === name.trim().toLowerCase());

  const add = (name: string) => {
    if (!name.trim() || find(name)) return;
    const kind: Skill['category'] = category === 'Soft Skills' ? 'soft' : 'technical';
    onChange([...skills, { id: createId(), name: name.trim(), category: kind, proficiency: 'intermediate' }]);
  };

  const remove = (skill: Skill) =>
    onChange(
      skills.filter((item) => item.id !== skill.id),
      `Removed "${skill.name}"`,
    );

  const addCustom = () => {
    add(custom);
    setCustom('');
  };

  return (
    <div className="wizard-step">
      {skills.length > 0 && (
        <div className="selected-skills-section">
          <h3>Your skills ({skills.length})</h3>
          <p className="helper-text">Levels help you plan; they are not printed as bars on the CV.</p>
          <ul className="skills-tags">
            {skills.map((skill) => (
              <li key={skill.id} className="skill-tag">
                <span className="skill-name">{skill.name}</span>
                <select
                  className="skill-proficiency-select"
                  aria-label={`${skill.name} level`}
                  value={skill.proficiency}
                  onChange={(e) =>
                    onChange(
                      skills.map((item) =>
                        item.id === skill.id ? { ...item, proficiency: e.target.value as Skill['proficiency'] } : item,
                      ),
                    )
                  }
                >
                  {SKILL_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="skill-remove"
                  aria-label={`Remove ${skill.name}`}
                  onClick={() => remove(skill)}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="inline-add">
        <input
          className="form-input"
          value={custom}
          aria-label="Add a skill"
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Type a skill and press Enter"
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
        />
        <button type="button" className="btn-primary btn-sm" onClick={addCustom} disabled={!custom.trim()}>
          + Add
        </button>
      </div>

      <div className="skill-categories">
        <div className="category-tabs" role="group" aria-label="Skill categories">
          {CATEGORIES.map((name) => (
            <button
              key={name}
              type="button"
              className={`category-tab${category === name ? ' active' : ''}`}
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="category-skills">
          {SUGGESTED_SKILLS[category].map((name) => {
            const selected = find(name);
            return (
              <button
                key={name}
                type="button"
                className={`suggestion-chip${selected ? ' selected' : ''}`}
                aria-pressed={Boolean(selected)}
                onClick={() => (selected ? remove(selected) : add(name))}
              >
                <span aria-hidden="true">{selected ? '✓' : '+'}</span> {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
