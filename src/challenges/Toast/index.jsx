import React, { useState, useEffect, useRef } from 'react';

// Toast types for styling
const TOAST_TYPES = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white'
};

// Direction animations
const DIRECTIONS = {
  'top-right': {
    container: 'top-4 right-4',
    enter: 'translate-x-full opacity-0',
    show: 'translate-x-0 opacity-100',
    exit: 'translate-x-full opacity-0'
  },
  'top-left': {
    container: 'top-4 left-4',
    enter: '-translate-x-full opacity-0',
    show: 'translate-x-0 opacity-100',
    exit: '-translate-x-full opacity-0'
  },
  'bottom-right': {
    container: 'bottom-4 right-4',
    enter: 'translate-x-full opacity-0',
    show: 'translate-x-0 opacity-100',
    exit: 'translate-x-full opacity-0'
  },
  'bottom-left': {
    container: 'bottom-4 left-4',
    enter: '-translate-x-full opacity-0',
    show: 'translate-x-0 opacity-100',
    exit: '-translate-x-full opacity-0'
  },
  'top-center': {
    container: 'top-4 left-1/2 transform -translate-x-1/2',
    enter: '-translate-y-full opacity-0',
    show: 'translate-y-0 opacity-100',
    exit: '-translate-y-full opacity-0'
  },
  'bottom-center': {
    container: 'bottom-4 left-1/2 transform -translate-x-1/2',
    enter: 'translate-y-full opacity-0',
    show: 'translate-y-0 opacity-100',
    exit: 'translate-y-full opacity-0'
  }
};

// Individual Toast component
const Toast = ({ 
  id, 
  message, 
  type = 'info', 
  duration = 3000, 
  direction = 'top-right',
  onRemove,
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef(null);
  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss timer
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleRemove();
      }, duration);
    }

    return () => {
      clearTimeout(enterTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    };
  }, [duration]);

  const handleRemove = () => {
    setIsExiting(true);
    exitTimeoutRef.current = setTimeout(() => {
      onRemove(id);
    }, 300); // Match transition duration
  };

  const directionConfig = DIRECTIONS[direction];
  const typeStyle = TOAST_TYPES[type];

  const getTransformClass = () => {
    if (isExiting) return directionConfig.exit;
    if (isVisible) return directionConfig.show;
    return directionConfig.enter;
  };

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full mx-4
        ${directionConfig.container}
        transition-all duration-300 ease-in-out
        ${getTransformClass()}
      `}
    >
      <div className={`
        rounded-lg shadow-lg p-4 flex items-center justify-between
        ${typeStyle}
      `}>
        <div className="flex items-center space-x-3">
          {/* Icon based on type */}
          <div className="flex-shrink-0">
            {type === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'error' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'warning' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {type === 'info' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Message */}
          <p className="text-sm font-medium">{message}</p>
        </div>

        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={handleRemove}
            className="ml-4 flex-shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Container with Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : 3000,
      direction: options.direction || 'top-right',
      showCloseButton: options.showCloseButton !== undefined ? options.showCloseButton : true
    };
    
    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    success: (message, options = {}) => addToast(message, { ...options, type: 'success' }),
    error: (message, options = {}) => addToast(message, { ...options, type: 'error' }),
    warning: (message, options = {}) => addToast(message, { ...options, type: 'warning' }),
    info: (message, options = {}) => addToast(message, { ...options, type: 'info' })
  };
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  // Group toasts by direction
  const toastsByDirection = toasts.reduce((acc, toast) => {
    const direction = toast.direction || 'top-right';
    if (!acc[direction]) acc[direction] = [];
    acc[direction].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(toastsByDirection).map(([direction, directionToasts]) => (
        <div key={direction} className="fixed z-50">
          {directionToasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onRemove={onRemove}
            />
          ))}
        </div>
      ))}
    </>
  );
};

// Demo App
export default function ToastDemo() {
  const { toasts, removeToast, success, error, warning, info, removeAllToasts } = useToast();
  const [direction, setDirection] = useState('top-right');
  const [duration, setDuration] = useState(3000);

  const showToast = (type) => {
    const messages = {
      success: 'Success! Operation completed successfully.',
      error: 'Error! Something went wrong.',
      warning: 'Warning! Please check your input.',
      info: 'Info! Here is some useful information.'
    };

    const options = {
      direction,
      duration: duration === 0 ? 0 : duration, // 0 means no auto-dismiss
    };

    switch (type) {
      case 'success':
        success(messages.success, options);
        break;
      case 'error':
        error(messages.error, options);
        break;
      case 'warning':
        warning(messages.warning, options);
        break;
      case 'info':
        info(messages.info, options);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Toast Notification System</h1>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Direction Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
              </select>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (ms)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1000}>1 second</option>
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
                <option value={0}>No auto-dismiss</option>
              </select>
            </div>
          </div>

          {/* Toast Buttons */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Show Toast</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => showToast('success')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => showToast('error')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => showToast('warning')}
                className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors"
              >
                Warning Toast
              </button>
              <button
                onClick={() => showToast('info')}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Info Toast
              </button>
              <button
                onClick={removeAllToasts}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Basic Usage:</strong> Import and use the <code className="bg-gray-100 px-2 py-1 rounded">useToast</code> hook in your components.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
{`const { success, error, warning, info } = useToast();

// Show different types of toasts
success('Operation successful!');
error('Something went wrong!');
warning('Please check your input.');
info('Here is some information.');

// With custom options
success('Custom toast!', {
  duration: 5000,
  direction: 'bottom-right',
  showCloseButton: false
});`}
              </pre>
            </div>
            <p>
              <strong>Available Options:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>duration</code>: Auto-dismiss time in ms (0 = no auto-dismiss)</li>
              <li><code>direction</code>: Position (top-right, top-left, top-center, bottom-right, bottom-left, bottom-center)</li>
              <li><code>showCloseButton</code>: Show/hide close button (default: true)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}