import React from 'react';
import * as PropTypes from 'prop-types';
import colorGenerator, { colorGeneratorType } from './ColorGenerator';
import './TagBullet.scss';

const propTypes = {
  tag: PropTypes.string.isRequired,
  colorGenerator: colorGeneratorType,
};
const defaultProps = {
  colorGenerator,
};

export default function TagBullet({ tag, colorGenerator }) {
  return (
    <div
      style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
      className="tag-bullet"
    />
  );
}

TagBullet.propTypes = propTypes;
TagBullet.defaultProps = defaultProps;
