import React from 'react';
import TagsInput from 'react-tagsinput';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { identity } from 'ramda';
import TagBullet from './TagBullet';
import './TagsSelector.scss';

const TagsSelector = (colorGenerator) => class TagsSelector extends React.Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    listTags: PropTypes.func,
    placeholder: PropTypes.string,
    tagsList: PropTypes.shape({
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  };
  static defaultProps = {
    placeholder: 'Add tags to the URL',
  };

  componentDidMount() {
    const { listTags } = this.props;

    listTags();
  }

  render() {
    const { tags, onChange, placeholder, tagsList } = this.props;
    const renderTag = ({ tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other }) => (
      <span key={key} style={{ backgroundColor: colorGenerator.getColorForKey(tag) }} {...other}>
        {getTagDisplayValue(tag)}
        {!disabled && <span className={classNameRemove} onClick={() => onRemove(key)} />}
      </span>
    );
    const renderAutocompleteInput = (data) => {
      const { addTag, ...otherProps } = data;
      const handleOnChange = (e, { method }) => {
        method === 'enter' ? e.preventDefault() : otherProps.onChange(e);
      };

      // eslint-disable-next-line no-extra-parens
      const inputValue = (otherProps.value && otherProps.value.trim().toLowerCase()) || '';
      const inputLength = inputValue.length;
      const suggestions = tagsList.tags.filter((state) => state.toLowerCase().slice(0, inputLength) === inputValue);

      return (
        <Autosuggest
          ref={otherProps.ref}
          suggestions={suggestions}
          inputProps={{ ...otherProps, onChange: handleOnChange }}
          highlightFirstSuggestion
          shouldRenderSuggestions={(value) => value && value.trim().length > 0}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={(suggestion) => (
            <React.Fragment>
              <TagBullet tag={suggestion} colorGenerator={colorGenerator} />
              {suggestion}
            </React.Fragment>
          )}
          onSuggestionSelected={(e, { suggestion }) => {
            addTag(suggestion);
          }}
          onSuggestionsClearRequested={identity}
          onSuggestionsFetchRequested={identity}
        />
      );
    };

    return (
      <TagsInput
        value={tags}
        inputProps={{ placeholder }}
        onlyUnique
        renderTag={renderTag}
        renderInput={renderAutocompleteInput}

        // FIXME Workaround to be able to add tags on Android
        addOnBlur
        onChange={onChange}
      />
    );
  }
};

export default TagsSelector;
