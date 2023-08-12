import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import type { OptionRendererProps, ReactTagsAPI, TagRendererProps, TagSuggestion } from 'react-tag-autocomplete';
import { ReactTags } from 'react-tag-autocomplete';
import type { ColorGenerator } from '../../utils/services/ColorGenerator';
import { useSetting } from '../../utils/settings';
import type { TagsList } from '../reducers/tagsList';
import { normalizeTag } from './index';
import { Tag } from './Tag';
import { TagBullet } from './TagBullet';

export interface TagsSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  allowNew?: boolean;
}

interface TagsSelectorConnectProps extends TagsSelectorProps {
  listTags: () => void;
  tagsList: TagsList;
}

const NOT_FOUND_TAG = 'Tag not found';
const NEW_TAG = 'Add tag';
const isSelectableOption = (tag: string) => tag !== NOT_FOUND_TAG;
const isNewOption = (tag: string) => tag === NEW_TAG;
const toTagObject = (tag: string): TagSuggestion => ({ label: tag, value: tag });

export const TagsSelector = (colorGenerator: ColorGenerator) => (
  { selectedTags, onChange, placeholder, listTags, tagsList, allowNew = true }: TagsSelectorConnectProps,
) => {
  useEffect(() => {
    listTags();
  }, []);

  const shortUrlCreation = useSetting('shortUrlCreation');
  const searchMode = shortUrlCreation?.tagFilteringMode ?? 'startsWith';
  const apiRef = useRef<ReactTagsAPI>(null);

  const ReactTagsTag = ({ tag, onClick: deleteTag }: TagRendererProps) => (
    <Tag colorGenerator={colorGenerator} text={tag.label} clearable className="react-tags__tag" onClose={deleteTag} />
  );
  const ReactTagsSuggestion = ({ option, classNames: classes, ...rest }: OptionRendererProps) => {
    const isSelectable = isSelectableOption(option.label);
    const isNew = isNewOption(option.label);

    return (
      <div
        className={classNames(classes.option, {
          [classes.optionIsActive]: isSelectable && option.active,
          'react-tags__listbox-option--not-selectable': !isSelectable,
        })}
        {...rest}
      >
        {!isSelectable ? <i>{option.label}</i> : (
          <>
            {!isNew && <TagBullet tag={`${option.label}`} colorGenerator={colorGenerator} />}
            {!isNew ? option.label : <i>Add &quot;{normalizeTag(apiRef.current?.input.value ?? '')}&quot;</i>}
          </>
        )}
      </div>
    );
  };

  return (
    <ReactTags
      ref={apiRef}
      selected={selectedTags.map(toTagObject)}
      suggestions={tagsList.tags.filter((tag) => !selectedTags.includes(tag)).map(toTagObject)}
      renderTag={ReactTagsTag}
      renderOption={ReactTagsSuggestion}
      activateFirstOption
      allowNew={allowNew}
      newOptionText={NEW_TAG}
      noOptionsText={NOT_FOUND_TAG}
      placeholderText={placeholder ?? 'Add tags to the URL'}
      delimiterKeys={['Enter', 'Tab', ',']}
      suggestionsTransform={
        (query, suggestions) => {
          const searchTerm = query.toLowerCase().trim();
          return searchTerm.length < 1 ? [] : [...suggestions.filter(
            ({ label }) => (searchMode === 'includes' ? label.includes(searchTerm) : label.startsWith(searchTerm)),
          )].slice(0, 5);
        }
      }
      onDelete={(removedTagIndex) => {
        const tagsCopy = [...selectedTags];
        tagsCopy.splice(removedTagIndex, 1);
        onChange(tagsCopy);
      }}
      onAdd={({ label: newTag }) => onChange(
        // * Avoid duplicated tags (thanks to the Set),
        // * Split any of the new tags by comma, allowing to paste multiple comma-separated tags at once.
        [...new Set([...selectedTags, ...newTag.split(',')])],
      )}
    />
  );
};
