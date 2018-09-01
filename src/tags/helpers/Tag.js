import React from 'react';
import PropTypes from 'prop-types';
import colorGenerator, { colorGeneratorType } from '../../utils/ColorGenerator';
import './Tag.scss';

const propTypes = {
  colorGenerator: colorGeneratorType,
  text: PropTypes.string,
  children: PropTypes.node,
  clearable: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};
const defaultProps = {
  colorGenerator,
};

export default function Tag(
  {
    colorGenerator,
    text,
    children,
    clearable,
    onClick = () => ({}),
    onClose = () => ({}),
  }
) {
  return (
    <span
      className="badge tag"
      style={{ backgroundColor: colorGenerator.getColorForKey(text), cursor: clearable ? 'auto' : 'pointer' }}
      onClick={onClick}
    >
      {children || text}
      {clearable && <span className="close tag__close-selected-tag" onClick={onClose}>&times;</span>}
    </span>
  );
}

Tag.defaultProps = defaultProps;
Tag.propTypes = propTypes;
