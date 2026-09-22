import React from 'react';

interface TemplateStepProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

const templates = [
  { id: 'classic', name: 'Classic Clean', description: 'Two-column layout with photo, summary, and a clear skills sidebar.', color: '#333333' },
  { id: 'modern', name: 'Modern Creative', description: 'Bold split name, gold title badge, and a contemporary two-column flow.', color: '#C4A962' },
  { id: 'professional', name: 'Professional Minimal', description: 'Name-forward letterhead with awards, skills, and references.', color: '#111111' },
  { id: 'elegant', name: 'Elegant Two-Column', description: 'Green date badges, education on the left, experience on the right.', color: '#7B8C56' },
  { id: 'creative', name: 'Creative Neon', description: 'Card-based layout with lime accents and a greeting-style header.', color: '#C6D94A' },
  { id: 'executive', name: 'Executive Blue', description: 'Spaced typography, blue last name, and ATS-friendly experience blocks.', color: '#2B5C9E' },
  { id: 'designer', name: 'Designer Bold', description: 'Photo plus a yellow accent bar through a large name lockup.', color: '#E8B820' },
  { id: 'minimal', name: 'Minimal Clean', description: 'Ultra-clean single-column layout that parses well in ATS systems.', color: '#555555' },
  { id: 'medical', name: 'Professional Medical', description: 'Blue circular photo, credentials sidebar, and clinical section headings.', color: '#2563EB' },
  { id: 'corporate', name: 'Corporate Standard', description: 'Standard corporate headings, skill chips, and a reliable ATS structure.', color: '#1a1a1a' },
];

const TemplateStep: React.FC<TemplateStepProps> = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Choose Your Template</h2>
        <p>Select a design that matches your brand. The live preview updates immediately, and download uses this template.</p>
      </div>

      <div className="template-grid">
        {templates.map((template) => (
          <div key={template.id} className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`} onClick={() => onSelect(template.id)}>
            <div className="template-preview" style={{ borderColor: template.color }}>
              <div className="template-mini-preview" data-template={template.id}>
                <div className="mini-header" style={{ backgroundColor: `${template.color}15`, borderBottom: `2px solid ${template.color}` }}>
                  <div className="mini-avatar" style={{ backgroundColor: `${template.color}30` }} />
                  <div className="mini-lines">
                    <div className="mini-line title" style={{ backgroundColor: template.color }} />
                    <div className="mini-line subtitle" style={{ backgroundColor: `${template.color}60` }} />
                  </div>
                </div>
                <div className="mini-body">
                  <div className="mini-section">
                    <div className="mini-line section-title" style={{ backgroundColor: template.color }} />
                    <div className="mini-line" />
                    <div className="mini-line short" />
                  </div>
                  <div className="mini-section">
                    <div className="mini-line section-title" style={{ backgroundColor: template.color }} />
                    <div className="mini-line" />
                    <div className="mini-line" />
                    <div className="mini-line short" />
                  </div>
                </div>
              </div>
              {selectedTemplate === template.id && (
                <div className="template-selected-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateStep;
