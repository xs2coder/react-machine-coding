import React, { useState, useEffect } from 'react';

// Basic Progress Bar Component
const ProgressBar = ({ progress, height = 20, color = '#4CAF50', backgroundColor = '#e0e0e0', showLabel = true }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="w-full mb-4">
      <div 
        className="relative rounded-full overflow-hidden"
        style={{ 
          height: `${height}px`,
          backgroundColor: backgroundColor 
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out rounded-full flex items-center justify-center"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: color
          }}
        >
          {showLabel && clampedProgress > 15 && (
            <span className="text-white text-sm font-medium">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      </div>
      {showLabel && clampedProgress <= 15 && (
        <div className="text-center mt-1 text-sm text-gray-600">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

// Animated Progress Bar with steps
const StepProgressBar = ({ currentStep, totalSteps, labels = [] }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        {labels.map((label, index) => (
          <div 
            key={index} 
            className={`text-sm ${index < currentStep ? 'text-green-600 font-medium' : 'text-gray-400'}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between absolute -top-1 w-full">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 ${
                i < currentStep
                  ? 'bg-green-500 border-green-500'
                  : i === currentStep
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              } transition-all duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Circular Progress Bar
const CircularProgress = ({ progress, size = 120, strokeWidth = 8, color = '#3B82F6' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Demo Component
export default function ProgressBarDemo() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const steps = ['Start', 'Process', 'Review', 'Complete'];
  
  // Auto-animate progress
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isAnimating]);
  
  const startAnimation = () => {
    setProgress(0);
    setIsAnimating(true);
  };
  
  const resetProgress = () => {
    setProgress(0);
    setCurrentStep(0);
    setIsAnimating(false);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        React Progress Bar Examples
      </h1>
      
      {/* Basic Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Basic Progress Bar</h2>
        <ProgressBar progress={progress} />
        
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={startAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Animate
          </button>
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Different Styles */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Different Styles</h2>
        <ProgressBar progress={progress} color="#FF6B6B" height={10} />
        <ProgressBar progress={progress} color="#4ECDC4" height={25} />
        <ProgressBar progress={progress} color="#45B7D1" height={15} showLabel={false} />
      </div>
      
      {/* Step Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Step Progress Bar</h2>
        <StepProgressBar 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          labels={steps}
        />
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Circular Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Circular Progress</h2>
        <CircularProgress progress={progress} />
        <div className="flex gap-4 justify-center">
          <CircularProgress progress={progress} size={80} color="#10B981" />
          <CircularProgress progress={progress} size={80} color="#F59E0B" />
          <CircularProgress progress={progress} size={80} color="#EF4444" />
        </div>
      </div>
    </div>
  );
}