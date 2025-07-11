import React from 'react';

interface FloatCtaProps {
  title: string;
  id: string;
  isArrowVisible: boolean;
  isScrollingUp: boolean;
  variant?: string;
}

const FloatCta: React.FC<FloatCtaProps> = ({ title, id, isArrowVisible, isScrollingUp, variant = 'default' }) => {
  return (
    <div id={'cta-view-list'} className={`cta-view-list ${isArrowVisible ? '' : 'hide'} ${variant ? variant : ''}`}>
      <div
        className="custom-btn custom-btn-primary"
        onClick={() => {
          const targetElement = document.getElementById(id);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        {title}

        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          id="arrow-view-groups"
          className={`icon-arrow-list ${isScrollingUp ? 'up' : 'down'}`}
        >
          <path
            d="M15.5 7.5L10.5 12.5L5.5 7.5"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default FloatCta;
