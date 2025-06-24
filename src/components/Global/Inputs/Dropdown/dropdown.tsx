import React, { useEffect, useRef, useState } from 'react';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

interface Option {
  label: string;
  value: string | number;
}

interface DropdownProps {
  title?: string;
  options: Option[];
  onSelect: (value: string | number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, onSelect }) => {
  const { t } = useTranslate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value: string | number) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${isOpen ? 'open' : ''}`}>
      <button className="dropdown-toggle" onClick={handleToggle}>
        {options.find((o) => o.value === selectedOption)?.label || title || t('dropdown_select_label')}
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
