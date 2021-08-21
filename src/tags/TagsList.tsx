import { FC, useEffect, useState } from 'react';
import { splitEvery } from 'ramda';
import { Row } from 'reactstrap';
import Message from '../utils/Message';
import SearchField from '../utils/SearchField';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { Topics } from '../mercure/helpers/Topics';
import { TagsList as TagsListState } from './reducers/tagsList';
import { TagCardProps } from './TagCard';

const { ceil } = Math;
const TAGS_GROUPS_AMOUNT = 4;

export interface TagsListProps {
  filterTags: (searchTerm: string) => void;
  forceListTags: Function;
  tagsList: TagsListState;
  selectedServer: SelectedServer;
}

const TagsList = (TagCard: FC<TagCardProps>) => boundToMercureHub((
  { filterTags, forceListTags, tagsList, selectedServer }: TagsListProps,
) => {
  const [ displayedTag, setDisplayedTag ] = useState<string | undefined>();

  useEffect(() => {
    forceListTags();
  }, []);

  if (tagsList.loading) {
    return <Message loading />;
  }

  const renderContent = () => {
    if (tagsList.error) {
      return (
        <Result type="error">
          <ShlinkApiError errorData={tagsList.errorData} fallbackMessage="Error loading tags :(" />
        </Result>
      );
    }

    const tagsCount = tagsList.filteredTags.length;

    if (tagsCount < 1) {
      return <Message>No tags found</Message>;
    }

    const tagsGroups = splitEvery(ceil(tagsCount / TAGS_GROUPS_AMOUNT), tagsList.filteredTags);

    return (
      <Row>
        {tagsGroups.map((group, index) => (
          <div key={index} className="col-md-6 col-xl-3">
            {group.map((tag) => (
              <TagCard
                key={tag}
                tag={tag}
                tagStats={tagsList.stats[tag]}
                selectedServer={selectedServer}
                displayed={displayedTag === tag}
                toggle={() => setDisplayedTag(displayedTag !== tag ? tag : undefined)}
              />
            ))}
          </div>
        ))}
      </Row>
    );
  };

  return (
    <>
      <SearchField className="mb-3" onChange={filterTags} />
      {renderContent()}
    </>
  );
}, () => [ Topics.visits ]);

export default TagsList;
