import { FC } from 'react';
import { isEmpty } from 'ramda';
import { Tag } from '../../tags/helpers/Tag';
import { ColorGenerator } from '../../utils/services/ColorGenerator';

interface TagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  colorGenerator: ColorGenerator;
  disabled?: boolean;
}

export const Tags: FC<TagsProps> = ({ tags, onTagClick, colorGenerator, disabled = false }) => {
  if (isEmpty(tags)) {
    return disabled ? null : <i className="indivisible"><small>No tags</small></i>;
  }

  return (
    <>
      {tags.map((tag) => (
        <Tag
          key={tag}
          text={tag}
          colorGenerator={colorGenerator}
          onClick={() => onTagClick?.(tag)}
        />
      ))}
    </>
  );
};
