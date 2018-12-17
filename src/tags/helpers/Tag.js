import React from 'react';
import PropTypes from 'prop-types';
import './Tag.scss';

const propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  clearable: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

const Tag = (colorGenerator) => {
  const Tag = ({
    text,
    children,
    clearable,
    onClick = () => {},
    onClose = () => {},
  }) => (
    <span
      className="badge tag"
      style={{ backgroundColor: colorGenerator.getColorForKey(text), cursor: clearable ? 'auto' : 'pointer' }}
      onClick={onClick}
    >
      {children || text}
      {clearable && <span className="close tag__close-selected-tag" onClick={onClose}>&times;</span>}
    </span>
  );

  Tag.propTypes = propTypes;

  return Tag;
};

export default Tag;
