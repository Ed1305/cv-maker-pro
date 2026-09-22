import React, { useCallback, useEffect, useState } from 'react';
import { ALL_SECTION_IDS, CVData, defaultCVData, SectionId } from './types/cv';
import StepIndicator from './components/UI/StepIndicator';
import PersonalInfoStep from './components/Wizard/PersonalInfoStep';
import SummaryStep from './components/Wizard/SummaryStep';
import SectionsStep from './components/Wizard/SectionsStep';
import ReviewStep from './components/Wizard/ReviewStep';
import LivePreview from './components/Preview/LivePreview';
import TemplateRenderer from './components/Templates/TemplateRenderer';
import { improveText, makeATSFriendlySummary, shortenText } from './utils/helpers';
import './styles.css';

const steps = [
  { number: 1, title: 'Personal', icon: '1' },
  { number: 2, title: 'About', icon: '2' },
  { number: 3, title: 'Sections', icon: '3' },
  { number: 4, title: 'Review', icon: '4' },
];

const inferEnabledSections = (data: Partial<CVData>): SectionId[] => {
  if (Array.isArray(data.enabledSections) && data.enabledSections.length > 0) {
    return data.enabledSections.filter((id): id is SectionId => ALL_SECTION_IDS.includes(id));
  }

  const inferred: SectionId[] = [];
  if (data.education?.length) inferred.push('education');
  if (data.workExperience?.length) inferred.push('experience');
  if (data.skills?.length) inferred.push('skills');
  if (data.languages?.length) inferred.push('languages');
  if (data.certifications?.length) inferred.push('certificates');
  if (data.interests?.length) inferred.push('interests');
  if (data.projects?.length) inferred.push('projects');
  if (data.courses?.length) inferred.push('courses');
  if (data.achievements?.length) inferred.push('awards');
  if (data.volunteerExperience?.length) inferred.push('organisations');
  if (data.publications?.length) inferred.push('publications');
  if (data.references?.length || data.includeReferences) inferred.push('references');
  if (data.declaration) inferred.push('declaration');
  if (data.customSections?.length) inferred.push('custom');

  return inferred.length ? inferred : ['education', 'experience', 'skills'];
};

const loadSavedData = (): CVData => {
  try {
    const saved = localStorage.getItem('cvData');
    if (!saved) return defaultCVData;
    const parsed = JSON.parse(saved) as Partial<CVData>;
    return {
      ...defaultCVData,
      ...parsed,
      personalInfo: { ...defaultCVData.personalInfo, ...parsed.personalInfo },
      professionalSummary: { ...defaultCVData.professionalSummary, ...parsed.professionalSummary },
      interests: parsed.interests || [],
      courses: parsed.courses || [],
      publications: parsed.publications || [],
      customSections: parsed.customSections || [],
      declaration: parsed.declaration || '',
      enabledSections: inferEnabledSections(parsed),
    };
  } catch {
    return defaultCVData;
  }
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVData>(loadSavedData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const updateField = useCallback(<K extends keyof CVData>(field: K, value: CVData[K]) => {
    setCvData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      const { createRoot } = await import('react-dom/client');

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.background = 'white';
      document.body.appendChild(container);

      const root = createRoot(container);
      await new Promise<void>((resolve) => {
        root.render(
          <div id="pdf-render" style={{ width: '210mm', background: 'white' }}>
            <TemplateRenderer data={cvData} scale={1} />
          </div>
        );
        setTimeout(resolve, 700);
      });

      const element = container.querySelector('#pdf-render') as HTMLElement;
      const safeName = (cvData.personalInfo.fullName || 'CV').replace(/[^\w\s-]/g, '').trim() || 'CV';

      await html2pdf()
        .set({
          margin: 0,
          filename: `${safeName}_Resume.pdf`,
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 3, useCORS: true, letterRendering: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(element)
        .save();

      root.unmount();
      document.body.removeChild(container);
    } catch (error) {
      console.error('PDF generation error:', error);
      window.print();
    } finally {
      setIsGenerating(false);
    }
  }, [cvData]);

  const handleImproveAll = () => {
    setCvData((prev) => ({
      ...prev,
      professionalSummary: {
        ...prev.professionalSummary,
        summary: improveText(prev.professionalSummary.summary),
      },
      workExperience: prev.workExperience.map((exp) => ({
        ...exp,
        responsibilities: exp.responsibilities.map((item) => (item ? improveText(item) : item)),
        achievements: exp.achievements.map((item) => (item ? improveText(item) : item)),
      })),
    }));
  };

  const handleMakeATS = () => {
    setCvData((prev) => ({
      ...prev,
      professionalSummary: {
        ...prev.professionalSummary,
        summary: makeATSFriendlySummary(
          prev.professionalSummary.summary,
          prev.personalInfo.professionalTitle,
          prev.skills.map((skill) => skill.name)
        ),
      },
    }));
  };

  const handleShorten = () => {
    setCvData((prev) => ({
      ...prev,
      professionalSummary: {
        ...prev.professionalSummary,
        summary: shortenText(prev.professionalSummary.summary),
      },
      workExperience: prev.workExperience.map((exp) => ({
        ...exp,
        responsibilities: exp.responsibilities.filter(Boolean).slice(0, 3),
        achievements: exp.achievements.filter(Boolean).slice(0, 2),
      })),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep data={cvData.personalInfo} onChange={(value) => updateField('personalInfo', value)} />;
      case 2:
        return <SummaryStep data={cvData.professionalSummary} onChange={(value) => updateField('professionalSummary', value)} />;
      case 3:
        return <SectionsStep data={cvData} onChange={setCvData} />;
      case 4:
        return (
          <ReviewStep
            data={cvData}
            onDownload={handleDownload}
            onGoToStep={setCurrentStep}
            onImproveAll={handleImproveAll}
            onMakeATS={handleMakeATS}
            onShorten={handleShorten}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-logo">
            <span className="logo-text">CV<span className="logo-accent">Maker</span></span>
          </h1>
        </div>
        <div className="header-center">
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
        </div>
        <div className="header-right">
          <button type="button" className="btn-mobile-preview" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            {showMobilePreview ? 'Form' : 'Preview'}
          </button>
          <button type="button" className="btn-header-download" onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Download'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className={`wizard-panel ${showMobilePreview ? 'hidden-mobile' : ''}`}>
          <div className="wizard-content">{renderStep()}</div>
          <div className="wizard-navigation">
            <button type="button" className="btn-nav btn-prev" onClick={prevStep} disabled={currentStep === 1}>Previous</button>
            <span className="step-counter">Step {currentStep} of {steps.length}</span>
            {currentStep < steps.length ? (
              <button type="button" className="btn-nav btn-next" onClick={nextStep}>Next</button>
            ) : (
              <button type="button" className="btn-nav btn-finish" onClick={handleDownload} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
            )}
          </div>
        </div>

        <div className={`preview-panel ${showMobilePreview ? 'visible-mobile' : ''}`}>
          <LivePreview data={cvData} onDownload={handleDownload} />
        </div>
      </main>

      {isGenerating && (
        <div className="generating-overlay">
          <div className="generating-modal">
            <div className="spinner" />
            <h3>Generating your CV...</h3>
            <p>Creating a high-quality PDF</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
