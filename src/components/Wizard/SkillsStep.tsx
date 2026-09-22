import React, { useState } from 'react';
import { Skill } from '../../types/cv';
import { generateId, suggestedSkills } from '../../utils/helpers';

interface SkillsStepProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ data, onChange }) => {
  const [customSkill, setCustomSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(suggestedSkills)[0]);

  const addSkill = (name: string, category: Skill['category'] = 'technical') => {
    if (data.some((skill) => skill.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...data, { id: generateId(), name, category, proficiency: 'intermediate' }]);
  };

  const removeSkill = (id: string) => onChange(data.filter((skill) => skill.id !== id));

  const handleCustomAdd = () => {
    if (!customSkill.trim()) return;
    addSkill(customSkill.trim(), activeCategory === 'Soft Skills' ? 'soft' : 'technical');
    setCustomSkill('');
  };

  const isSelected = (name: string) => data.some((skill) => skill.name.toLowerCase() === name.toLowerCase());

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Skills</h2>
        <p>Pick skills from categories or add your own. Proficiency is stored for editing, but not shown as bars on the CV.</p>
      </div>

      {data.length > 0 && (
        <div className="selected-skills-section">
          <h3>Your Skills ({data.length})</h3>
          <div className="skills-tags">
            {data.map((skill) => (
              <div key={skill.id} className="skill-tag">
                <span className="skill-name">{skill.name}</span>
                <select
                  className="skill-proficiency-select"
                  value={skill.proficiency}
                  onChange={(e) => onChange(data.map((item) => (item.id === skill.id ? { ...item, proficiency: e.target.value as Skill['proficiency'] } : item)))}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <button type="button" className="skill-remove" onClick={() => removeSkill(skill.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="add-custom-skill">
        <input
          className="form-input"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          placeholder="Type a skill and press Enter or click Add"
          onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
        />
        <button type="button" className="btn-primary btn-sm" onClick={handleCustomAdd}>+ Add</button>
      </div>

      <div className="skill-categories">
        <div className="category-tabs">
          {Object.keys(suggestedSkills).map((cat) => (
            <button key={cat} type="button" className={`category-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="category-skills">
          {suggestedSkills[activeCategory]?.map((skill) => (
            <button
              key={skill}
              type="button"
              className={`suggestion-chip ${isSelected(skill) ? 'selected' : ''}`}
              onClick={() => (isSelected(skill) ? removeSkill(data.find((item) => item.name === skill)?.id || '') : addSkill(skill, activeCategory === 'Soft Skills' ? 'soft' : 'technical'))}
            >
              {isSelected(skill) ? '✓' : '+'} {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsStep;
