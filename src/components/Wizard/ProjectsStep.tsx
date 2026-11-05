import { useState } from 'react';
import FormField from '../UI/FormField';
import ItemCard from '../UI/ItemCard';
import { createId } from '../../cv/id';
import type { Project } from '../../cv/schema';
import { polishParagraph } from '../../cv/text';
import { isValidUrl } from '../../cv/validation';
import { type EditorProps, moveItem, replaceById } from './types';

const emptyProject = (): Project => ({
  id: createId(),
  name: '',
  description: '',
  role: '',
  technologies: '',
  problem: '',
  contribution: '',
  projectUrl: '',
  githubUrl: '',
  date: '',
});

const urlError = (value: string) =>
  value.trim() && !isValidUrl(value) ? 'Enter a web address, e.g. github.com/you/project.' : undefined;

const ProjectsStep = ({ value: list, onChange }: EditorProps<Project[]>) => {
  const [expandedId, setExpandedId] = useState<string | null>(list[0]?.id ?? null);
  const update = (id: string, patch: Partial<Project>, undoLabel?: string) =>
    onChange(replaceById(list, id, patch), undoLabel);

  const add = () => {
    const project = emptyProject();
    onChange([...list, project]);
    setExpandedId(project.id);
  };

  const draftDescription = (project: Project) => {
    const draft = polishParagraph(
      [project.problem, project.contribution, project.technologies && `Built with ${project.technologies}`]
        .map((part) => part.trim().replace(/[.!]+$/, ''))
        .filter(Boolean)
        .join('. '),
    );
    if (draft) update(project.id, { description: draft }, 'Drafted project description');
  };

  return (
    <div className="wizard-step">
      {list.length === 0 && (
        <div className="empty-state">
          <h3>No projects added yet</h3>
          <p>Add projects to show your practical skills.</p>
        </div>
      )}

      {list.map((project, index) => {
        const title = project.name || 'Untitled project';
        return (
          <ItemCard
            key={project.id}
            title={title}
            subtitle={project.technologies || undefined}
            expanded={expandedId === project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
            onRemove={() =>
              onChange(
                list.filter((item) => item.id !== project.id),
                `Deleted "${title}"`,
              )
            }
            onMoveUp={index > 0 ? () => onChange(moveItem(list, index, -1)) : undefined}
            onMoveDown={index < list.length - 1 ? () => onChange(moveItem(list, index, 1)) : undefined}
          >
            <div className="form-grid">
              <FormField
                label="Project name"
                value={project.name}
                onChange={(v) => update(project.id, { name: v })}
                placeholder="e.g. Customer support portal"
                required
              />
              <FormField
                label="Your role"
                value={project.role}
                onChange={(v) => update(project.id, { role: v })}
                placeholder="e.g. Lead developer"
                optional
              />
            </div>
            <FormField
              label="Technologies used"
              value={project.technologies}
              onChange={(v) => update(project.id, { technologies: v })}
              placeholder="e.g. FastAPI, PostgreSQL, React"
              optional
            />
            <div className="helper-card">
              <p>Answer these two questions and we'll draft the description for you.</p>
              <FormField
                label="What problem did it solve?"
                value={project.problem}
                onChange={(v) => update(project.id, { problem: v })}
                placeholder="e.g. Customer queries took days to answer"
              />
              <FormField
                label="What did you personally build?"
                value={project.contribution}
                onChange={(v) => update(project.id, { contribution: v })}
                placeholder="e.g. Built the backend API and WhatsApp integration"
              />
              <button type="button" className="btn-secondary btn-sm" onClick={() => draftDescription(project)}>
                Draft description
              </button>
            </div>
            <FormField
              label="Project description"
              value={project.description}
              onChange={(v) => update(project.id, { description: v })}
              multiline
              rows={3}
              placeholder="One or two sentences on what it does and the impact."
            />
            <div className="form-grid">
              <FormField
                label="Project link"
                value={project.projectUrl}
                onChange={(v) => update(project.id, { projectUrl: v })}
                placeholder="https://project-url.com"
                type="url"
                inputMode="url"
                optional
                error={urlError(project.projectUrl)}
              />
              <FormField
                label="GitHub link"
                value={project.githubUrl}
                onChange={(v) => update(project.id, { githubUrl: v })}
                placeholder="https://github.com/you/project"
                type="url"
                inputMode="url"
                optional
                error={urlError(project.githubUrl)}
              />
            </div>
            <FormField
              label="Date"
              value={project.date}
              onChange={(v) => update(project.id, { date: v })}
              type="month"
              optional
            />
          </ItemCard>
        );
      })}

      <button type="button" className="btn-add-section" onClick={add}>
        <span className="plus-icon" aria-hidden="true">
          +
        </span>
        Add project
      </button>
    </div>
  );
};

export default ProjectsStep;
