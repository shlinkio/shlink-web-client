import { useEffect } from 'react';
import type { SuggestionComponentProps, TagComponentProps } from 'react-tag-autocomplete';
import ReactTags from 'react-tag-autocomplete';
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

const toComponentTag = (tag: string) => ({ id: tag, name: tag });

export const TagsSelector = (colorGenerator: ColorGenerator) => (
  { selectedTags, onChange, placeholder, listTags, tagsList, allowNew = true }: TagsSelectorConnectProps,
) => {
  const shortUrlCreation = useSetting('shortUrlCreation');
  useEffect(() => {
    listTags();
  }, []);

  const searchMode = shortUrlCreation?.tagFilteringMode ?? 'startsWith';
  const ReactTagsTag = ({ tag, onDelete }: TagComponentProps) =>
    <Tag colorGenerator={colorGenerator} text={tag.name} clearable className="react-tags__tag" onClose={onDelete} />;
  const ReactTagsSuggestion = ({ item }: SuggestionComponentProps) => (
    <>
      <TagBullet tag={`${item.name}`} colorGenerator={colorGenerator} />
      {item.name}
    </>
  );

  return (
    <ReactTags
      tags={selectedTags.map(toComponentTag)}
      tagComponent={ReactTagsTag}
      suggestions={tagsList.tags.filter((tag) => !selectedTags.includes(tag)).map(toComponentTag)}
      suggestionComponent={ReactTagsSuggestion}
      allowNew={allowNew}
      addOnBlur
      placeholderText={placeholder ?? 'Add tags to the URL'}
      minQueryLength={1}
      delimiters={['Enter', 'Tab', ',']}
      suggestionsTransform={
        searchMode === 'includes'
          ? (query, suggestions) => suggestions.filter(({ name }) => name.includes(query))
          : undefined
      }
      onDelete={(removedTagIndex) => {
        const tagsCopy = [...selectedTags];

        tagsCopy.splice(removedTagIndex, 1);
        onChange(tagsCopy);
      }}
      onAddition={({ name: newTag }) => onChange(
        // * Avoid duplicated tags (thanks to the Set),
        // * Split any of the new tags by comma, allowing to paste multiple comma-separated tags at once.
        [...new Set([...selectedTags, ...newTag.toLowerCase().split(',')])],
      )}
    />
  );
};
