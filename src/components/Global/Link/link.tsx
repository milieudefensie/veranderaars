import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { getCtaUrl } from '../../../utils';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string | { slug?: string; content?: { slug?: string }; link?: { content?: string; externalUrl?: string }; externalUrl?: string };
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ to, children, ...rest }) => {
  if (typeof to === 'string') {
    return (
      <GatsbyLink to={to} {...rest}>
        {children}
      </GatsbyLink>
    );
  } else if (to?.slug || to?.content?.slug || to?.link?.content) {
    const url = getCtaUrl(to);

    return (
      <GatsbyLink to={url} {...rest}>
        {children}
      </GatsbyLink>
    );
  } else if (to?.externalUrl || to?.link?.externalUrl) {
    if (to?.link?.externalUrl && to?.link?.externalUrl.includes('#section-')) {
      return (
        <GatsbyLink to={to.link.externalUrl} {...rest}>
          {children}
        </GatsbyLink>
      );
    } else {
      return (
        <a href={to?.externalUrl || to.link?.externalUrl} {...rest} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
  } else {
    return <a {...rest}>{children}</a>;
  }
};

export default Link;
