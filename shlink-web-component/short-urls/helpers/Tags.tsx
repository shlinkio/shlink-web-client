import { isEmpty } from 'ramda';
import type { FC } from 'react';
import type { ColorGenerator } from '../../../src/utils/services/ColorGenerator';
import { Tag } from '../../tags/helpers/Tag';

interface TagsProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  colorGenerator: ColorGenerator;
}

export const Tags: FC<TagsProps> = ({ tags, onTagClick, colorGenerator }) => {
  if (isEmpty(tags)) {
    return <i className="indivisible"><small>No tags</small></i>;
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
