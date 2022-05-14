import { FC, useState } from 'react';
import { splitEvery } from 'ramda';
import { Row } from 'reactstrap';
import { TagCardProps } from './TagCard';
import { TagsListChildrenProps } from './data/TagsListChildrenProps';

const { ceil } = Math;
const TAGS_GROUPS_AMOUNT = 4;

export const TagsCards = (TagCard: FC<TagCardProps>): FC<TagsListChildrenProps> => ({ sortedTags, selectedServer }) => {
  const [displayedTag, setDisplayedTag] = useState<string | undefined>();
  const tagsCount = sortedTags.length;
  const tagsGroups = splitEvery(ceil(tagsCount / TAGS_GROUPS_AMOUNT), sortedTags);

  return (
    <Row>
      {tagsGroups.map((group, index) => (
        <div key={index} className="col-md-6 col-xl-3">
          {group.map((tag) => (
            <TagCard
              key={tag.tag}
              tag={tag}
              selectedServer={selectedServer}
              displayed={displayedTag === tag.tag}
              toggle={() => setDisplayedTag(displayedTag !== tag.tag ? tag.tag : undefined)}
            />
          ))}
        </div>
      ))}
    </Row>
  );
};
