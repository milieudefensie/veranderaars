import React from 'react';
import Link from '../Link/Link';
import separatorIcon from '../../Icons/breadcrumb-separator.svg';
import separatorWhiteIcon from '../../Icons/breadcrumb-white-separator.svg';

import './index.scss';

const Breadcrumb = ({ textWhite = false, breadcrumb = null, currentPage }) => {
  const renderSeparator = (index = 1) => {
    if (index === 0) {
      return null;
    }

    return (
      <span>
        <img src={textWhite ? separatorWhiteIcon : separatorIcon} alt="Separator icon" />
      </span>
    );
  };

  return (
    <div className={`breadcrumb d-none d-lg-block ${textWhite ? 'text-white' : ''}`} data-datocms-noindex>
      <ul>
        <li>
          <Link to="/">Home</Link>
          {renderSeparator()}
        </li>

        {breadcrumb && (
          <>
            <li>
              <Link to={breadcrumb}>{breadcrumb.title}</Link>
            </li>
            {renderSeparator()}
          </>
        )}

        <li className="active">{currentPage}</li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
