import React, { useState, useEffect } from 'react';

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage: string;
}

const SignalModal: React.FC<SignalModalProps> = ({ isOpen, onClose, defaultMessage }) => {
  const [shareSignalMessage, setShareSignalMessage] = useState(defaultMessage);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      setShareSignalMessage(defaultMessage);
    };
  }, [isOpen]);

  useEffect(() => {
    setShareSignalMessage(defaultMessage);
  }, [defaultMessage]);

  if (!isOpen) return null;

  return (
    <div className="signal-overlay" onClick={onClose}>
      <div className="signal-popup" onClick={(e) => e.stopPropagation()}>
        <div className="signal-header">
          <svg viewBox="0 0 24 24" width="36px" height="36px">
            <path
              fill="currentColor"
              d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"
            ></path>
          </svg>
          Bericht gekopieerd!
        </div>

        <p className="signal-description">
          Open Signal, kies naar wie je een berichtje wil sturen, en plak dit bericht:
        </p>

        <textarea
          className="signal-message"
          value={shareSignalMessage}
          onChange={(e) => setShareSignalMessage(e.target.value)}
        />

        <a href={`https://signal.me/#eu`} className="btn-open-signal" target="_blank" rel="noopener noreferrer">
          Open Signal
        </a>
      </div>
    </div>
  );
};

export default SignalModal;
