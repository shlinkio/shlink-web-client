import React from 'react';
import TagsInput from 'react-tagsinput';
import PropTypes from 'prop-types';
import colorGenerator, { colorGeneratorType } from './ColorGenerator';

const defaultProps = {
  colorGenerator,
  placeholder: 'Add tags to the URL',
};
const propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  colorGenerator: colorGeneratorType,
};

export default function TagsSelector({ tags, onChange, placeholder, colorGenerator }) {
  const renderTag = ({ tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other }) => (
    <span key={key} style={{ backgroundColor: colorGenerator.getColorForKey(tag) }} {...other}>
      {getTagDisplayValue(tag)}
      {!disabled && <span className={classNameRemove} onClick={() => onRemove(key)} />}
    </span>
  );

  return (
    <TagsInput
      value={tags}
      inputProps={{ placeholder }}
      onlyUnique
      renderTag={renderTag}

      // FIXME Workaround to be able to add tags on Android
      addOnBlur
      onChange={onChange}
    />
  );
}

TagsSelector.defaultProps = defaultProps;
TagsSelector.propTypes = propTypes;
