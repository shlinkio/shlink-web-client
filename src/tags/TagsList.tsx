import { FC, useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { pipe } from 'ramda';
import Message from '../utils/Message';
import SearchField from '../utils/SearchField';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { Topics } from '../mercure/helpers/Topics';
import { Settings, TagsMode } from '../settings/reducers/settings';
import { determineOrderDir, sortList } from '../utils/helpers/ordering';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { TagsList as TagsListState } from './reducers/tagsList';
import {
  TagsOrderableFields,
  TAGS_ORDERABLE_FIELDS,
  TagsListChildrenProps,
  TagsOrder,
} from './data/TagsListChildrenProps';
import { TagsModeDropdown } from './TagsModeDropdown';
import { NormalizedTag } from './data';
import { TagsTableProps } from './TagsTable';

export interface TagsListProps {
  filterTags: (searchTerm: string) => void;
  forceListTags: Function;
  tagsList: TagsListState;
  selectedServer: SelectedServer;
  settings: Settings;
}

const TagsList = (TagsCards: FC<TagsListChildrenProps>, TagsTable: FC<TagsTableProps>) => boundToMercureHub((
  { filterTags, forceListTags, tagsList, selectedServer, settings }: TagsListProps,
) => {
  const [mode, setMode] = useState<TagsMode>(settings.tags?.defaultMode ?? 'cards');
  const [order, setOrder] = useState<TagsOrder>(settings.tags?.defaultOrdering ?? {});
  const resolveSortedTags = pipe(
    () => tagsList.filteredTags.map((tag): NormalizedTag => ({
      tag,
      shortUrls: tagsList.stats[tag]?.shortUrlsCount ?? 0,
      visits: tagsList.stats[tag]?.visitsCount ?? 0,
    })),
    (normalizedTags) => sortList<NormalizedTag>(normalizedTags, order),
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

    return mode === 'cards'
      ? <TagsCards sortedTags={sortedTags} selectedServer={selectedServer} />
      : (
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
        <div className="col-lg-6">
          <TagsModeDropdown mode={mode} onChange={setMode} />
        </div>
        <div className="col-lg-6 mt-3 mt-lg-0">
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

export default TagsList;
