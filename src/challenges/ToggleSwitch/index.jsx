import React, { useState } from 'react';

const ToggleSwitch = ({ 
  id,
  label, 
  description,
  defaultChecked = false, 
  onChange,
  disabled = false,
  size = 'md'
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Size variants
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-5',
      thumb: 'w-3 h-3',
      translate: 'translate-x-3'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-8',
      thumb: 'w-6 h-6',
      translate: 'translate-x-6'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col">
        {label && (
          <label 
            htmlFor={id}
            className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'} cursor-pointer`}
          >
            {label}
          </label>
        )}
        {description && (
          <span className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </span>
        )}
      </div>
      
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        aria-describedby={description ? `${id}-description` : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${currentSize.switch} rounded-full
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled 
            ? 'cursor-not-allowed opacity-50' 
            : 'cursor-pointer hover:shadow-md'
          }
          ${isChecked 
            ? (disabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700') 
            : (disabled ? 'bg-gray-200' : 'bg-gray-300 hover:bg-gray-400')
          }
        `}
      >
        <span className="sr-only">
          {label ? `Toggle ${label.toLowerCase()}` : 'Toggle switch'}
        </span>
        
        <span
          className={`
            ${currentSize.thumb} bg-white rounded-full shadow-md
            transform transition-transform duration-200 ease-in-out
            ${isChecked ? currentSize.translate : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

// Demo component showing different variations
const ToggleSwitchDemo = () => {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <div className="max-w-md mx-auto p-8 space-y-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Toggle Switch Examples</h1>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Basic Toggles</h2>
          
          <ToggleSwitch
            id="notifications"
            label="Push Notifications"
            description="Receive notifications about updates and messages"
            defaultChecked={notifications}
            onChange={setNotifications}
          />
          
          <ToggleSwitch
            id="marketing"
            label="Marketing Emails"
            description="Get updates about new features and promotions"
            defaultChecked={marketing}
            onChange={setMarketing}
          />
          
          <ToggleSwitch
            id="analytics"
            label="Analytics & Performance"
            description="Help us improve by sharing usage data"
            defaultChecked={analytics}
            onChange={setAnalytics}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Size Variants</h2>
          
          <ToggleSwitch
            id="small"
            label="Small Toggle"
            size="sm"
            defaultChecked={true}
          />
          
          <ToggleSwitch
            id="medium"
            label="Medium Toggle (Default)"
            size="md"
            defaultChecked={true}
          />
          
          <ToggleSwitch
            id="large"
            label="Large Toggle"
            size="lg"
            defaultChecked={true}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">States</h2>
          
          <ToggleSwitch
            id="disabled-on"
            label="Disabled (On)"
            description="This toggle is disabled in the on state"
            defaultChecked={true}
            disabled={true}
          />
          
          <ToggleSwitch
            id="disabled-off"
            label="Disabled (Off)"
            description="This toggle is disabled in the off state"
            defaultChecked={false}
            disabled={true}
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Current State:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Notifications: {notifications ? 'On' : 'Off'}</div>
          <div>Marketing: {marketing ? 'On' : 'Off'}</div>
          <div>Analytics: {analytics ? 'On' : 'Off'}</div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Accessibility Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keyboard navigation (Space/Enter)</li>
          <li>• Screen reader support with ARIA</li>
          <li>• Focus indicators</li>
          <li>• Semantic labeling</li>
          <li>• Disabled state handling</li>
        </ul>
      </div>
    </div>
  );
};

export default ToggleSwitchDemo;