import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyCv, type CVData, type SectionId } from './cv/schema';
import { backupFileName, parseBackup, serialize } from './cv/storage';
import { polishCv, trimToKeyPoints, withKeySkills } from './cv/text';
import { downloadBlob } from './lib/download';
import type { PatchCv } from './sections/registry';
import { useCvStore } from './state/useCvStore';
import DataMenu from './components/DataMenu';
import LivePreview from './components/Preview/LivePreview';
import StepIndicator, { type WizardStep } from './components/UI/StepIndicator';
import Toast, { type ToastMessage } from './components/UI/Toast';
import PersonalInfoStep from './components/Wizard/PersonalInfoStep';
import ReviewStep from './components/Wizard/ReviewStep';
import SectionsStep from './components/Wizard/SectionsStep';
import SummaryStep from './components/Wizard/SummaryStep';

const STEPS: WizardStep[] = [
  { number: 1, title: 'Personal' },
  { number: 2, title: 'About' },
  { number: 3, title: 'Sections' },
  { number: 4, title: 'Review' },
];

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const App = () => {
  const { data, update, commit, undo, saveOk } = useCvStore();
  const [step, setStep] = useState(1);
  const [editing, setEditing] = useState<SectionId | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastId = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const notify = useCallback((message: Omit<ToastMessage, 'id'>) => {
    toastId.current += 1;
    setToast({ ...message, id: toastId.current });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const undoWithToast = useCallback(() => {
    const label = undo();
    if (label) notify({ message: `Undone: ${label}` });
  }, [undo, notify]);

  /** Undoable change with an "Undo" toast. */
  const change = useCallback(
    (label: string, recipe: (cv: CVData) => CVData) => {
      if (commit(label, recipe)) notify({ message: label, action: { label: 'Undo', onClick: undoWithToast } });
      else notify({ message: 'Nothing to change.' });
    },
    [commit, notify, undoWithToast],
  );

  const patch: PatchCv = useCallback(
    (fields, undoLabel) => {
      if (undoLabel) change(undoLabel, (cv) => ({ ...cv, ...fields }));
      else update((cv) => ({ ...cv, ...fields }));
    },
    [change, update],
  );

  // Ctrl/Cmd+Z undoes CV-level changes when the user isn't typing in a field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        event.key.toLowerCase() === 'z' &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        undoWithToast();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undoWithToast]);

  // Move focus to the new step's heading so keyboard and screen-reader users know where they are.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    contentRef.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
    const panel = contentRef.current?.closest('.wizard-panel');
    if (panel) panel.scrollTop = 0;
  }, [step, editing]);

  const goTo = (target: number, section: SectionId | null = null) => {
    setStep(target);
    setEditing(section);
    setShowPreview(false);
  };

  const handleDownload = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const { exportCvPdf } = await import('./pdf/exportPdf');
      await exportCvPdf(data);
      notify({ message: 'Your PDF has been downloaded.' });
    } catch (error) {
      console.error('PDF generation failed', error);
      notify({ tone: 'error', message: "Couldn't create the PDF. Please try again — your CV is still saved." });
    } finally {
      setExporting(false);
    }
  };

  const handleExport = () =>
    downloadBlob(new Blob([serialize(data)], { type: 'application/json' }), backupFileName(data));

  const handleImport = async (file: File) => {
    try {
      const restored = parseBackup(await file.text());
      change('Restored CV from backup', () => restored);
      goTo(4);
    } catch (error) {
      notify({ tone: 'error', message: error instanceof Error ? error.message : "Couldn't read that file." });
    }
  };

  const handleReset = () => {
    change('Started a new CV', () => createEmptyCv());
    goTo(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep value={data.personalInfo} onChange={(next) => patch({ personalInfo: next })} />;
      case 2:
        return (
          <SummaryStep
            value={data.professionalSummary}
            onChange={(next, label) => patch({ professionalSummary: next }, label)}
          />
        );
      case 3:
        return <SectionsStep data={data} patch={patch} editing={editing} onEdit={setEditing} />;
      default:
        return (
          <ReviewStep
            data={data}
            exporting={exporting}
            onDownload={handleDownload}
            onGoTo={(target, section) => goTo(target, section ?? null)}
            onPolish={() => change('Polished wording', polishCv)}
            onKeySkills={() =>
              change('Added key skills to summary', (cv) => ({
                ...cv,
                professionalSummary: {
                  ...cv.professionalSummary,
                  summary: withKeySkills(
                    cv.professionalSummary.summary,
                    cv.skills.map((skill) => skill.name),
                  ),
                },
              }))
            }
            onTrim={() => change('Trimmed to key points', trimToKeyPoints)}
          />
        );
    }
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to form
      </a>
      <header className="app-header">
        <p className="app-logo">
          CV<span className="logo-accent">Maker</span>
        </p>
        <div className="header-center">
          <StepIndicator steps={STEPS} currentStep={step} onStepClick={(target) => goTo(target)} />
        </div>
        <div className="header-right">
          <DataMenu onExport={handleExport} onImport={handleImport} onReset={handleReset} />
          <button
            type="button"
            className="btn-mobile-preview"
            aria-pressed={showPreview}
            onClick={() => setShowPreview((value) => !value)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            className="btn-header-download"
            onClick={handleDownload}
            disabled={exporting}
            aria-busy={exporting}
          >
            {exporting ? 'Preparing…' : 'Download'}
          </button>
        </div>
      </header>

      {!saveOk && (
        <div className="save-warning" role="alert">
          Your browser isn't letting us save (private mode or storage full). Use{' '}
          <strong>Your data → Download backup</strong> so you don't lose your work.
        </div>
      )}

      <main className="app-main">
        <div className={`wizard-panel${showPreview ? ' hidden-mobile' : ''}`}>
          <div className="wizard-content" id="main-content" ref={contentRef}>
            {renderStep()}
          </div>
          <div className="wizard-navigation">
            <button type="button" className="btn-nav btn-prev" onClick={() => goTo(step - 1)} disabled={step === 1}>
              Back
            </button>
            <span className="step-counter">
              Step {step} of {STEPS.length}
            </span>
            {step < STEPS.length ? (
              <button type="button" className="btn-nav btn-next" onClick={() => goTo(step + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className="btn-nav btn-finish" onClick={handleDownload} disabled={exporting}>
                {exporting ? 'Preparing…' : 'Download PDF'}
              </button>
            )}
          </div>
        </div>

        <aside className={`preview-panel${showPreview ? ' visible-mobile' : ''}`} aria-label="CV preview">
          <LivePreview data={data} exporting={exporting} onDownload={handleDownload} />
        </aside>
      </main>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
