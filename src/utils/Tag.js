import React from 'react';
import ColorGenerator from '../utils/ColorGenerator';
import './Tag.scss';

export default function Tag (
  {
    colorGenerator,
    text,
    clearable,
    onClick = () => ({}),
    onClose = () => ({})
  }
) {
  return (
    <span
      className="badge tag"
      style={{ backgroundColor: colorGenerator.getColorForKey(text), cursor: clearable ? 'auto' : 'pointer' }}
      onClick={onClick}
    >
      {text}
      {clearable && <span className="close tag__close-selected-tag" onClick={onClose}>&times;</span>}
    </span>
  );
}

Tag.defaultProps = {
  colorGenerator: ColorGenerator
};
