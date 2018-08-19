import React from 'react';
import TagsInput from 'react-tagsinput';
import ColorGenerator, { colorGeneratorType } from './ColorGenerator';
import PropTypes from 'prop-types';

const defaultProps = {
  colorGenerator: ColorGenerator,
  placeholder: 'Add tags to the URL',
};
const propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  colorGenerator: colorGeneratorType
};

export default function TagsSelector({ tags, onChange, placeholder, colorGenerator }) {
  const renderTag = (props) => {
    const { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other } = props;
    return (
      <span key={key} style={{ backgroundColor: colorGenerator.getColorForKey(tag) }} {...other}>
        {getTagDisplayValue(tag)}
        {!disabled && <a className={classNameRemove} onClick={() => onRemove(key)}> </a>}
      </span>
    )
  };

  return (
    <TagsInput
      value={tags}
      onChange={onChange}
      inputProps={{ placeholder }}
      onlyUnique
      addOnBlur // FIXME Workaround to be able to add tags on Android
      renderTag={renderTag}
    />
  );
}

TagsSelector.defaultProps = defaultProps;
TagsSelector.propTypes = propTypes;
