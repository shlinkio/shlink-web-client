import React, { ChangeEvent, useEffect } from 'react';
import TagsInput, { RenderInputProps, RenderTagProps } from 'react-tagsinput';
import Autosuggest, { ChangeEvent as AutoChangeEvent, SuggestionSelectedEventData } from 'react-autosuggest';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { TagsList } from '../reducers/tagsList';
import TagBullet from './TagBullet';
import './TagsSelector.scss';

export interface TagsSelectorProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

interface TagsSelectorConnectProps extends TagsSelectorProps {
  listTags: Function;
  tagsList: TagsList;
}

const TagsSelector = (colorGenerator: ColorGenerator) => (
  { tags, onChange, listTags, tagsList, placeholder = 'Add tags to the URL' }: TagsSelectorConnectProps,
) => {
  useEffect(() => {
    listTags();
  }, []);

  const renderTag = (
    { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other }: RenderTagProps<string>,
  ) => (
    <span key={key} style={{ backgroundColor: colorGenerator.getColorForKey(tag) }} {...other}>
      {getTagDisplayValue(tag)}
      {!disabled && <span className={classNameRemove} onClick={() => onRemove(key)} />}
    </span>
  );
  const renderAutocompleteInput = (data: RenderInputProps<string>) => {
    const { addTag, ...otherProps } = data;
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, { method }: AutoChangeEvent) => {
      method === 'enter' ? e.preventDefault() : otherProps.onChange(e);
    };

    const inputValue = otherProps.value?.trim().toLowerCase() ?? '';
    const suggestions = tagsList.tags.filter((tag) => tag.startsWith(inputValue));

    return (
      <Autosuggest
        ref={otherProps.ref}
        suggestions={suggestions}
        inputProps={{ ...otherProps, onChange: handleOnChange }}
        highlightFirstSuggestion
        shouldRenderSuggestions={(value: string) => value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => (
          <React.Fragment>
            <TagBullet tag={suggestion} colorGenerator={colorGenerator} />
            {suggestion}
          </React.Fragment>
        )}
        onSuggestionsFetchRequested={() => {}}
        onSuggestionSelected={(_, { suggestion }: SuggestionSelectedEventData<string>) => {
          addTag(suggestion);
        }}
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
};

export default TagsSelector;
