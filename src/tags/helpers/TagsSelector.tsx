import { useEffect } from 'react';
import ReactTags, { SuggestionComponentProps, TagComponentProps } from 'react-tag-autocomplete';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { TagsList } from '../reducers/tagsList';
import TagBullet from './TagBullet';
import Tag from './Tag';

export interface TagsSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

interface TagsSelectorConnectProps extends TagsSelectorProps {
  listTags: Function;
  tagsList: TagsList;
}

const toComponentTag = (tag: string) => ({ id: tag, name: tag });

const TagsSelector = (colorGenerator: ColorGenerator) => (
  { selectedTags, onChange, listTags, tagsList, placeholder = 'Add tags to the URL' }: TagsSelectorConnectProps,
) => {
  useEffect(() => {
    listTags();
  }, []);

  const renderTag = ({ tag, onDelete }: TagComponentProps) =>
    <Tag colorGenerator={colorGenerator} text={tag.name} clearable className="react-tags__tag" onClose={onDelete} />;
  const renderSuggestion = ({ item }: SuggestionComponentProps) => (
    <>
      <TagBullet tag={`${item.name}`} colorGenerator={colorGenerator} />
      {item.name}
    </>
  );

  return (
    <ReactTags
      tags={selectedTags.map(toComponentTag)}
      tagComponent={renderTag}
      suggestions={tagsList.tags.filter((tag) => !selectedTags.includes(tag)).map(toComponentTag)}
      suggestionComponent={renderSuggestion}
      allowNew
      placeholderText={placeholder}
      onDelete={(removedTagIndex) => {
        selectedTags.splice(removedTagIndex, 1);

        onChange(selectedTags);
      }}
      onAddition={({ name: newTag }) => {
        const tags = [ ...selectedTags, newTag.toLowerCase() ]; // eslint-disable-line @typescript-eslint/no-unsafe-call

        onChange(tags);
      }}
    />
  );
};

export default TagsSelector;
