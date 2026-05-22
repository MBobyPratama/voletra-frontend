import React from 'react';

interface ProgresRegisProps {
  currentStep?: 1 | 2;
}

const STEPS = [
  { number: 1, label: 'Registration' },
  { number: 2, label: 'Material Upload' },
];

const ProgresRegis: React.FC<ProgresRegisProps> = ({ currentStep = 1 }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;

        return (
          <React.Fragment key={step.number}>
            {/* Step circle + label */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive || isDone
                    ? 'bg-primary-normal text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm font-medium ${
                  isActive || isDone ? 'text-primary-normal' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Garis penghubung */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 max-w-[200px] h-0.5 bg-gray-200 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-primary-normal transition-all duration-300"
                  style={{ width: currentStep > step.number ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgresRegis;
