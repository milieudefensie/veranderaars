import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';

const Dropdown = ({ title, options, onSelect }) => {
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${isOpen ? 'open' : ''}`}>
      <button className="dropdown-toggle" onClick={handleToggle}>
        {options.find((o) => o.value === selectedOption)?.label || title || 'Select an option'}
      </button>

      <ul className="dropdown-menu">
        {options.map((option) => (
          <li key={option.value} onClick={() => handleOptionClick(option.value)}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
