import React, { useState } from 'react';
import FormField from '../UI/FormField';
import { Project } from '../../types/cv';
import { generateId } from '../../utils/helpers';

interface ProjectsStepProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsStep: React.FC<ProjectsStepProps> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(data[0]?.id || null);

  const addProject = () => {
    const newProject: Project = {
      id: generateId(),
      name: '',
      description: '',
      role: '',
      technologies: '',
      problem: '',
      contribution: '',
      projectUrl: '',
      githubUrl: '',
      date: '',
    };
    onChange([...data, newProject]);
    setExpandedId(newProject.id);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(data.map((project) => (project.id === id ? { ...project, [field]: value } : project)));
  };

  const generateDescription = (id: string) => {
    const project = data.find((item) => item.id === id);
    if (!project) return;
    const parts = [
      project.name && `${project.name}`,
      project.problem,
      project.contribution,
      project.technologies && `Built with ${project.technologies}.`,
    ].filter(Boolean);
    if (parts.length) updateProject(id, 'description', parts.join('. ').replace(/\.\./g, '.'));
  };

  return (
    <div className="wizard-step">
      <div className="step-header">
        <h2>Projects</h2>
        <p>Showcase your best work. This is especially valuable for developers and designers.</p>
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <h3>No projects added yet</h3>
          <p>Add projects to demonstrate your practical skills</p>
        </div>
      )}

      {data.map((project) => (
        <div key={project.id} className={`experience-card ${expandedId === project.id ? 'expanded' : ''}`}>
          <div className="experience-card-header" onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}>
            <div className="experience-card-info">
              <h3>{project.name || 'Untitled Project'}</h3>
              <p>{project.technologies || 'Technologies'}</p>
            </div>
            <div className="experience-card-actions">
              <button type="button" className="btn-icon btn-delete" onClick={(e) => { e.stopPropagation(); onChange(data.filter((item) => item.id !== project.id)); }}>🗑</button>
              <span className={`chevron ${expandedId === project.id ? 'open' : ''}`}>▼</span>
            </div>
          </div>

          {expandedId === project.id && (
            <div className="experience-card-body">
              <div className="form-grid">
                <FormField label="Project Name" value={project.name} onChange={(v) => updateProject(project.id, 'name', v)} placeholder="e.g. OmniGig Support System" required />
                <FormField label="Your Role" value={project.role} onChange={(v) => updateProject(project.id, 'role', v)} placeholder="e.g. Lead Developer" />
              </div>
              <FormField label="Technologies Used" value={project.technologies} onChange={(v) => updateProject(project.id, 'technologies', v)} placeholder="e.g. FastAPI, PostgreSQL, React, Docker" />
              <FormField label="What problem did it solve?" value={project.problem} onChange={(v) => updateProject(project.id, 'problem', v)} placeholder="e.g. Manual customer support was taking too long" />
              <FormField label="What did you personally build?" value={project.contribution} onChange={(v) => updateProject(project.id, 'contribution', v)} placeholder="e.g. Built the backend API and integrated WhatsApp messaging" />
              <div className="section-header-inline">
                <h4>Project Description</h4>
                <button type="button" className="btn-text" onClick={() => generateDescription(project.id)}>Generate Description</button>
              </div>
              <FormField label="" value={project.description} onChange={(v) => updateProject(project.id, 'description', v)} multiline rows={3} placeholder="A comprehensive description of the project..." />
              <div className="form-grid">
                <FormField label="Project URL" value={project.projectUrl} onChange={(v) => updateProject(project.id, 'projectUrl', v)} placeholder="https://project-url.com" optional />
                <FormField label="GitHub URL" value={project.githubUrl} onChange={(v) => updateProject(project.id, 'githubUrl', v)} placeholder="https://github.com/user/project" optional />
              </div>
              <FormField label="Date" value={project.date} onChange={(v) => updateProject(project.id, 'date', v)} type="month" optional />
            </div>
          )}
        </div>
      ))}

      <button type="button" className="btn-add-section" onClick={addProject}>
        <span className="plus-icon">+</span>
        Add Project
      </button>
    </div>
  );
};

export default ProjectsStep;
