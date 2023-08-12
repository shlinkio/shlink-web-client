import { useEffect } from 'react';
import type { OptionRendererProps, TagRendererProps, TagSuggestion } from 'react-tag-autocomplete';
import { ReactTags } from 'react-tag-autocomplete';
import type { ColorGenerator } from '../../utils/services/ColorGenerator';
import { useSetting } from '../../utils/settings';
import type { TagsList } from '../reducers/tagsList';
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

const toTagSuggestion = (tag: string): TagSuggestion => ({ label: tag, value: tag });

export const TagsSelector = (colorGenerator: ColorGenerator) => (
  { selectedTags, onChange, placeholder, listTags, tagsList, allowNew = true }: TagsSelectorConnectProps,
) => {
  const shortUrlCreation = useSetting('shortUrlCreation');
  useEffect(() => {
    listTags();
  }, []);

  const searchMode = shortUrlCreation?.tagFilteringMode ?? 'startsWith';
  const ReactTagsTag = ({ tag, onClick: deleteTag }: TagRendererProps) => (
    <Tag colorGenerator={colorGenerator} text={tag.label} clearable className="react-tags__tag" onClose={deleteTag} />
  );
  const ReactTagsSuggestion = ({ option }: OptionRendererProps) => (
    <>
      <TagBullet tag={`${option.label}`} colorGenerator={colorGenerator} />
      {option.label}
    </>
  );

  return (
    <ReactTags
      selected={selectedTags.map(toTagSuggestion)}
      suggestions={tagsList.tags.filter((tag) => !selectedTags.includes(tag)).map(toTagSuggestion)}
      renderTag={ReactTagsTag}
      renderOption={ReactTagsSuggestion}
      allowNew={allowNew}
      // addOnBlur TODO Implement manually
      placeholderText={placeholder ?? 'Add tags to the URL'}
      onShouldExpand={(value) => value.length > 1}
      delimiterKeys={['Enter', 'Tab', ',']}
      suggestionsTransform={
        searchMode === 'includes'
          ? (query, suggestions) => suggestions.filter(({ label }) => label.includes(query))
          : undefined
      }
      onDelete={(removedTagIndex) => {
        const tagsCopy = [...selectedTags];

        tagsCopy.splice(removedTagIndex, 1);
        onChange(tagsCopy);
      }}
      onAdd={({ label: newTag }) => onChange(
        // * Avoid duplicated tags (thanks to the Set),
        // * Split any of the new tags by comma, allowing to paste multiple comma-separated tags at once.
        [...new Set([...selectedTags, ...newTag.toLowerCase().split(',')])],
      )}
    />
  );
};
