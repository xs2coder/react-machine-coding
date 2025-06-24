import React, { useState, useEffect, useRef } from 'react';

// Modal component with full accessibility support
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '',
  showCloseButton = true 
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Handle focus management and cleanup
  useEffect(() => {
    if (isOpen) {
      // Focus the modal container or first focusable element
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
        firstFocusableRef.current = focusableElements[0];
      } else {
        modalRef.current?.focus();
      }

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus to previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            // Shift + Tab: if focused on first element, go to last
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab: if focused on last element, go to first
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby="modal-content"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto ${className}`}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {title && (
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div id="modal-content" className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Demo component showing the modal in action
const ModalDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Accessible Modal Dialog Component
      </h1>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Features:</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Proper ARIA roles, states, and properties</li>
          <li>Focus management and focus trapping</li>
          <li>Keyboard navigation (Tab, Shift+Tab, Escape)</li>
          <li>Screen reader announcements</li>
          <li>Backdrop click to close</li>
          <li>Body scroll prevention</li>
          <li>Customizable styling</li>
        </ul>
      </div>

      <div className="space-x-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Open Basic Modal
        </button>
        
        <button
          onClick={openConfirmModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Open Confirmation Modal
        </button>
      </div>

      {/* Basic Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Basic Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This is a basic modal dialog. You can close it by:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
            <li>Clicking the X button</li>
            <li>Pressing the Escape key</li>
            <li>Clicking outside the modal</li>
          </ul>
          
          <div className="space-y-2">
            <label htmlFor="demo-input" className="block text-sm font-medium text-gray-700">
              Test input for focus management:
            </label>
            <input
              id="demo-input"
              type="text"
              placeholder="Try tabbing around..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        title="Confirm Action"
        className="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={closeConfirmModal}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDemo;