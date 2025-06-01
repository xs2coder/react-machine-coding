import React, { useState, useRef, useEffect } from 'react';

const countryOptions = [
  { label: 'Canada', value: 'ca' },
  { label: 'United States', value: 'us' },
  { label: 'India', value: 'in' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
];

export const Dropdown = ({
  label = 'Select',
  options = countryOptions,
  onSelect = () => {},
  selected = null,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [internalSelected, setInternalSelected] = useState(null);
  const dropdownRef = useRef(null);

  const finalSelected = selected ?? internalSelected;

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleSelect = (option) => {
    if (selected === null) setInternalSelected(option);
    onSelect(option);
    closeDropdown();
  };

  const handleClickOutside = (e) => {
    if (!dropdownRef.current.contains(e.target)) closeDropdown();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev === 0 || prev === -1 ? options.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0) handleSelect(options[focusedIndex]);
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, focusedIndex, options]);

  return (
    <div className="relative inline-block w-64" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-full border rounded px-4 py-2 text-left bg-white"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {finalSelected?.label || placeholder}
      </button>
      {isOpen && (
        <ul
          tabIndex="-1"
          role="listbox"
          className="absolute z-10 w-full bg-white border mt-1 rounded shadow"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={finalSelected?.value === option.value}
              className={`px-4 py-2 cursor-pointer ${
                focusedIndex === index ? 'bg-blue-100' : ''
              }`}
              onMouseEnter={() => setFocusedIndex(index)}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

