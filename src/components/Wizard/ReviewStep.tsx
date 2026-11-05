import type { CVData, SectionId } from '../../cv/schema';
import { buildChecklist, completionPercent, validateCv, type Issue } from '../../cv/validation';
import { LIMITS } from '../../cv/text';

interface ReviewStepProps {
  data: CVData;
  exporting: boolean;
  onDownload: () => void;
  onGoTo: (step: 1 | 2 | 3, section?: SectionId) => void;
  onPolish: () => void;
  onKeySkills: () => void;
  onTrim: () => void;
}

const IssueItem = ({ issue, onGoTo }: { issue: Issue; onGoTo: ReviewStepProps['onGoTo'] }) => (
  <li className={`issue issue-${issue.level}`}>
    <span className="issue-level">{issue.level === 'error' ? 'Fix' : 'Tip'}</span>
    <span className="issue-message">{issue.message}</span>
    <button type="button" className="btn-text" onClick={() => onGoTo(issue.step, issue.section)}>
      Go to it
    </button>
  </li>
);

const ReviewStep = ({ data, exporting, onDownload, onGoTo, onPolish, onKeySkills, onTrim }: ReviewStepProps) => {
  const checklist = buildChecklist(data);
  const percent = completionPercent(checklist);
  const issues = validateCv(data);
  const errors = issues.filter((issue) => issue.level === 'error');
  const hasSkills = data.skills.some((skill) => skill.name.trim());

  return (
    <div className="wizard-step review-step">
      <div className="step-header">
        <h2 tabIndex={-1}>Review your CV</h2>
        <p>Check what's missing, tidy up the wording, then download your PDF.</p>
      </div>

      <div className="completion-meter">
        <div className="completion-header">
          <span id="completion-label">CV completeness</span>
          <span className="completion-percentage">{percent}%</span>
        </div>
        <div
          className="completion-bar"
          role="progressbar"
          aria-labelledby="completion-label"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="completion-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ul className="review-checklist">
        {checklist.map((item) => (
          <li key={item.label}>
            <button type="button" className="review-item" onClick={() => onGoTo(item.step, item.section)}>
              <span className="review-name">{item.label}</span>
              <span className={`review-status ${item.complete ? 'done' : 'missing'}`}>
                {item.complete ? 'Complete' : 'Needs work'}
              </span>
              <span className="review-edit" aria-hidden="true">
                Edit →
              </span>
            </button>
          </li>
        ))}
      </ul>

      {issues.length > 0 && (
        <section className="issues" aria-labelledby="issues-heading">
          <h3 id="issues-heading">
            {errors.length ? `${errors.length} thing${errors.length > 1 ? 's' : ''} to fix` : 'Suggestions'}
          </h3>
          <ul>
            {issues.map((issue, index) => (
              <IssueItem key={index} issue={issue} onGoTo={onGoTo} />
            ))}
          </ul>
        </section>
      )}

      <section className="tools" aria-labelledby="tools-heading">
        <h3 id="tools-heading">Quick fixes</h3>
        <p className="helper-text">These are simple rules, not AI. Each one can be undone.</p>
        <div className="tool-grid">
          <button type="button" className="tool-card" onClick={onPolish}>
            <span className="tool-title">Polish wording</span>
            <span className="tool-desc">
              Removes "I…" and "Responsible for…" from bullets and fixes capitalisation and punctuation.
            </span>
          </button>
          <button type="button" className="tool-card" onClick={onKeySkills} disabled={!hasSkills}>
            <span className="tool-title">Add key skills to summary</span>
            <span className="tool-desc">
              Adds a "Key skills:" line with your top skills, so applicant tracking systems pick them up.
            </span>
          </button>
          <button type="button" className="tool-card" onClick={onTrim}>
            <span className="tool-title">Trim to key points</span>
            <span className="tool-desc">
              Halves the summary and keeps the first {LIMITS.responsibilities} responsibilities and{' '}
              {LIMITS.achievements} achievements per job.
            </span>
          </button>
        </div>
      </section>

      <div className="download-section">
        <button type="button" className="btn-download-large" onClick={onDownload} disabled={exporting}>
          {exporting ? 'Preparing PDF…' : 'Download PDF'}
        </button>
        <p className="download-note">
          A4, text-based PDF — readable by applicant tracking systems. Created in your browser; nothing is uploaded.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
