import React from 'react';

const FloatCta = ({ title, id, isArrowVisible, isScrollingUp }) => {
  return (
    <div id={'cta-view-list'} className={`cta-view-list ${isArrowVisible ? '' : 'hide'}`}>
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
            stroke="white"
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
