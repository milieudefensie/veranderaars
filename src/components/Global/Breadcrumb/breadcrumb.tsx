import React from 'react';
import Link from '../Link/link'; // @ts-expect-error
import separatorIcon from '../../Icons/breadcrumb-separator.svg'; // @ts-expect-error
import separatorWhiteIcon from '../../Icons/breadcrumb-white-separator.svg';

import './index.scss';

interface BreadcrumbProps {
  textWhite?: boolean;
  breadcrumb?: {
    title: string;
    url: string;
  } | null;
  currentPage: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ textWhite = false, breadcrumb = null, currentPage }) => {
  const renderSeparator = (index: number = 1): React.ReactNode => {
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
