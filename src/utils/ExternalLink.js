import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default function ExternalLink(props) {
  const { href, children, ...rest } = props;

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children || href}
    </a>
  );
}

ExternalLink.propTypes = propTypes;
