import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  isOpen: boolean;
  steps: ProgressStep[];
  title: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ isOpen, steps, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {index !== steps.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 w-0.5 h-16 transition-colors duration-500 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`} 
                />
              )}
              <div className="flex items-start">
                <div className="relative flex items-center justify-center flex-shrink-0">
                  {step.status === 'processing' ? (
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full border-4 border-blue-200"></div>
                      <Loader2 className="h-10 w-10 text-blue-500 animate-spin absolute top-0 left-0" />
                    </div>
                  ) : step.status === 'completed' ? (
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-green-100"></div>
                      <CheckCircle2 className="h-10 w-10 text-green-500 absolute top-0 left-0" />
                    </div>
                  ) : step.status === 'error' ? (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 text-xl font-bold">!</span>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full border-2 border-gray-200" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-medium ${
                    step.status === 'processing' ? 'text-blue-600' :
                    step.status === 'completed' ? 'text-green-600' :
                    step.status === 'error' ? 'text-red-600' :
                    'text-gray-900'
                  }`}>{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;