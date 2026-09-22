import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <button
            type="button"
            className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            onClick={() => onStepClick(step.number)}
          >
            <div className="step-circle">
              {currentStep > step.number ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <span className="step-title">{step.title}</span>
          </button>
          {index < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.number ? 'completed' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
