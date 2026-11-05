import { Fragment } from 'react';
import { CheckIcon } from './icons';

export interface WizardStep {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => (
  <nav aria-label="Progress">
    <ol className="step-indicator">
      {steps.map((step, index) => {
        const done = currentStep > step.number;
        const active = currentStep === step.number;
        return (
          <Fragment key={step.number}>
            <li>
              <button
                type="button"
                className={`step-item${active ? ' active' : ''}${done ? ' completed' : ''}`}
                aria-current={active ? 'step' : undefined}
                onClick={() => onStepClick(step.number)}
              >
                <span className="step-circle" aria-hidden="true">
                  {done ? <CheckIcon /> : step.number}
                </span>
                <span className="step-title">
                  <span className="visually-hidden">{`Step ${step.number}: `}</span>
                  {step.title}
                  {done && <span className="visually-hidden"> (done)</span>}
                </span>
              </button>
            </li>
            {index < steps.length - 1 && (
              <li aria-hidden="true" className={`step-connector${done ? ' completed' : ''}`} />
            )}
          </Fragment>
        );
      })}
    </ol>
  </nav>
);

export default StepIndicator;
