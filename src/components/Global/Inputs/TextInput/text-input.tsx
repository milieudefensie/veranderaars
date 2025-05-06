import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';

interface TextInputProps {
  label: string;
  name: string;
  required?: boolean;
  onChange: (value: string) => void;
  icon?: string | null;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, required = false, onChange, icon = null }) => {
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [focus, setFocused] = useState(false);
  const [text, setText] = useState('');

  const isFocused = focus || text.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={inputRef} className="custom-input-wrapper">
      <div className={`hs-form-field ${isFocused ? 'focused' : ''}`}>
        <label>
          <span>{label}</span>
          {required && <span className="hs-form-required">*</span>}

          {icon ? <img src={icon} alt="Input icon" className="icon" /> : null}
        </label>

        <div className="input">
          <input
            name={name}
            required={required}
            type="text"
            className="hs-input"
            inputMode="text"
            autoComplete="off"
            value={text}
            onFocus={() => setFocused(true)}
            onChange={(e) => {
              setText(e.target.value);
              onChange(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;
