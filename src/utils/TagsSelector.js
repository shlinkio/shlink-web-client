import React from 'react';
import { connect } from 'react-redux';
import TagsInput from 'react-tagsinput';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { pick, identity } from 'ramda';
import { listTags } from '../tags/reducers/tagsList';
import colorGenerator, { colorGeneratorType } from './ColorGenerator';
import './TagsSelector.scss';
import TagBullet from './TagBullet';

export class TagsSelectorComponent extends React.Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    colorGenerator: colorGeneratorType,
    tagsList: PropTypes.shape({
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
  };
  static defaultProps = {
    colorGenerator,
    placeholder: 'Add tags to the URL',
  };

  componentDidMount() {
    const { listTags } = this.props;

    listTags();
  }

  render() {
    const { tags, onChange, placeholder, colorGenerator, tagsList } = this.props;
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
              <TagBullet tag={suggestion} />
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
}

const TagsSelector = connect(pick([ 'tagsList' ]), { listTags })(TagsSelectorComponent);

export default TagsSelector;
