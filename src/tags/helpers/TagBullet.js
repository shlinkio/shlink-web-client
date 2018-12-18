import React from 'react';
import * as PropTypes from 'prop-types';
import { colorGeneratorType } from '../../utils/ColorGenerator';
import './TagBullet.scss';

const propTypes = {
  tag: PropTypes.string.isRequired,
  colorGenerator: colorGeneratorType,
};

const TagBullet = ({ tag, colorGenerator }) => (
  <div
    style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
    className="tag-bullet"
  />
);

TagBullet.propTypes = propTypes;

export default TagBullet;
