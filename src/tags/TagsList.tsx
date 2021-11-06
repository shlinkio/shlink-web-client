import { FC, useEffect, useMemo, useState } from 'react';
import { Row } from 'reactstrap';
import { pipe } from 'ramda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import Message from '../utils/Message';
import SearchField from '../utils/SearchField';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { Topics } from '../mercure/helpers/Topics';
import { Settings, TagsMode } from '../settings/reducers/settings';
import { determineOrderDir, sortList } from '../utils/helpers/ordering';
import { TagsList as TagsListState } from './reducers/tagsList';
import { OrderableFields, TagsListChildrenProps, TagsOrder } from './data/TagsListChildrenProps';
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
  const [ mode, setMode ] = useState<TagsMode>(settings.ui?.tagsMode ?? 'cards');
  const [ order, setOrder ] = useState<TagsOrder>({});
  const sortedTags = useMemo(
    pipe(
      () => tagsList.filteredTags.map((tag): NormalizedTag => ({
        tag,
        shortUrls: tagsList.stats[tag]?.shortUrlsCount ?? 0,
        visits: tagsList.stats[tag]?.visitsCount ?? 0,
      })),
      (normalizedTags) => sortList<NormalizedTag>(normalizedTags, order),
    ),
    [ tagsList.filteredTags, order ],
  );

  useEffect(() => {
    forceListTags();
  }, []);

  if (tagsList.loading) {
    return <Message loading />;
  }

  const orderByColumn = (field: OrderableFields) =>
    () => setOrder({ field, dir: determineOrderDir(field, order.field, order.dir) });
  const renderOrderIcon = (field: OrderableFields) => order.dir && order.field === field &&
    <FontAwesomeIcon icon={order.dir === 'ASC' ? caretUpIcon : caretDownIcon} className="ml-1" />;
  const renderContent = () => {
    if (tagsList.error) {
      return (
        <Result type="error">
          <ShlinkApiError errorData={tagsList.errorData} fallbackMessage="Error loading tags :(" />
        </Result>
      );
    }

    if (tagsList.filteredTags.length < 1) {
      return <Message>No tags found</Message>;
    }

    return mode === 'cards'
      ? <TagsCards sortedTags={sortedTags} selectedServer={selectedServer} />
      : (
        <TagsTable
          sortedTags={sortedTags}
          selectedServer={selectedServer}
          orderByColumn={orderByColumn}
          renderOrderIcon={renderOrderIcon}
        />
      );
  };

  return (
    <>
      <SearchField className="mb-3" onChange={filterTags} />
      <Row className="mb-3">
        <div className="col-lg-6 offset-lg-6">
          <TagsModeDropdown mode={mode} onChange={setMode} />
        </div>
      </Row>
      {renderContent()}
    </>
  );
}, () => [ Topics.visits ]);

export default TagsList;
