import { pipe } from 'ramda';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { SelectedServer } from '../servers/data';
import type { Settings } from '../settings/reducers/settings';
import { determineOrderDir, sortList } from '../utils/helpers/ordering';
import { Message } from '../utils/Message';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { Result } from '../utils/Result';
import { SearchField } from '../utils/SearchField';
import type { SimplifiedTag } from './data';
import type { TagsOrder, TagsOrderableFields } from './data/TagsListChildrenProps';
import { TAGS_ORDERABLE_FIELDS } from './data/TagsListChildrenProps';
import type { TagsList as TagsListState } from './reducers/tagsList';
import type { TagsTableProps } from './TagsTable';

export interface TagsListProps {
  filterTags: (searchTerm: string) => void;
  forceListTags: Function;
  tagsList: TagsListState;
  selectedServer: SelectedServer;
  settings: Settings;
}

export const TagsList = (TagsTable: FC<TagsTableProps>) => boundToMercureHub((
  { filterTags, forceListTags, tagsList, selectedServer, settings }: TagsListProps,
) => {
  const [order, setOrder] = useState<TagsOrder>(settings.tags?.defaultOrdering ?? {});
  const resolveSortedTags = pipe(
    () => tagsList.filteredTags.map((tag): SimplifiedTag => {
      const theTag = tagsList.stats[tag];
      const visits = (
        settings.visits?.excludeBots ? theTag?.visitsSummary?.nonBots : theTag?.visitsSummary?.total
      ) ?? theTag?.visitsCount ?? 0;

      return {
        tag,
        visits,
        shortUrls: theTag?.shortUrlsCount ?? 0,
      };
    }),
    (simplifiedTags) => sortList<SimplifiedTag>(simplifiedTags, order),
  );

  useEffect(() => {
    forceListTags();
  }, []);

  if (tagsList.loading) {
    return <Message loading />;
  }

  if (tagsList.error) {
    return (
      <Result type="error">
        <ShlinkApiError errorData={tagsList.errorData} fallbackMessage="Error loading tags :(" />
      </Result>
    );
  }

  const orderByColumn = (field: TagsOrderableFields) => () => {
    const dir = determineOrderDir(field, order.field, order.dir);

    setOrder({ field: dir ? field : undefined, dir });
  };

  const renderContent = () => {
    if (tagsList.filteredTags.length < 1) {
      return <Message>No tags found</Message>;
    }

    const sortedTags = resolveSortedTags();

    return (
      <TagsTable
        sortedTags={sortedTags}
        selectedServer={selectedServer}
        currentOrder={order}
        orderByColumn={orderByColumn}
      />
    );
  };

  return (
    <>
      <SearchField className="mb-3" onChange={filterTags} />
      <Row className="mb-3">
        <div className="col-lg-6 offset-lg-6">
          <OrderingDropdown
            items={TAGS_ORDERABLE_FIELDS}
            order={order}
            onChange={(field, dir) => setOrder({ field, dir })}
          />
        </div>
      </Row>
      {renderContent()}
    </>
  );
}, () => [Topics.visits]);
