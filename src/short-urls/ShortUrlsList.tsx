import { pipe } from 'ramda';
import { FC, useEffect, useMemo, useState } from 'react';
import { Card } from 'reactstrap';
import { useLocation, useParams } from 'react-router-dom';
import { OrderingDropdown } from '../utils/OrderingDropdown';
import { determineOrderDir, OrderDir } from '../utils/helpers/ordering';
import { getServerId, SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { TableOrderIcon } from '../utils/table/TableOrderIcon';
import { ShlinkShortUrlsListParams } from '../api/types';
import { DEFAULT_SHORT_URLS_ORDERING, Settings } from '../settings/reducers/settings';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { ShortUrlsTableProps } from './ShortUrlsTable';
import Paginator from './Paginator';
import { useShortUrlsQuery } from './helpers/hooks';
import { ShortUrlsOrderableFields, SHORT_URLS_ORDERABLE_FIELDS } from './data';
import { ShortUrlsFilteringProps } from './ShortUrlsFilteringBar';

interface ShortUrlsListProps {
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  settings: Settings;
}

const ShortUrlsList = (
  ShortUrlsTable: FC<ShortUrlsTableProps>,
  ShortUrlsFilteringBar: FC<ShortUrlsFilteringProps>,
) => boundToMercureHub(({ listShortUrls, shortUrlsList, selectedServer, settings }: ShortUrlsListProps) => {
  const serverId = getServerId(selectedServer);
  const { page } = useParams();
  const location = useLocation();
  const [{ tags, search, startDate, endDate, orderBy, tagsMode }, toFirstPage ] = useShortUrlsQuery();
  const [ actualOrderBy, setActualOrderBy ] = useState(
    // This separated state handling is needed to be able to fall back to settings value, but only once when loaded
    orderBy ?? settings.shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING,
  );
  const selectedTags = useMemo(() => tags?.split(',') ?? [], [ tags ]);
  const { pagination } = shortUrlsList?.shortUrls ?? {};
  const handleOrderBy = (field?: ShortUrlsOrderableFields, dir?: OrderDir) => {
    toFirstPage({ orderBy: { field, dir } });
    setActualOrderBy({ field, dir });
  };
  const orderByColumn = (field: ShortUrlsOrderableFields) => () =>
    handleOrderBy(field, determineOrderDir(field, actualOrderBy.field, actualOrderBy.dir));
  const renderOrderIcon = (field: ShortUrlsOrderableFields) =>
    <TableOrderIcon currentOrder={actualOrderBy} field={field} />;
  const addTag = pipe(
    (newTag: string) => [ ...new Set([ ...selectedTags, newTag ]) ].join(','),
    (tags) => toFirstPage({ tags }),
  );

  useEffect(() => {
    listShortUrls({
      page,
      searchTerm: search,
      tags: selectedTags,
      startDate,
      endDate,
      orderBy: actualOrderBy,
      tagsMode,
    });
  }, [ page, search, selectedTags, startDate, endDate, actualOrderBy, tagsMode ]);

  return (
    <>
      <ShortUrlsFilteringBar selectedServer={selectedServer} className="mb-3" />
      <div className="d-block d-lg-none mb-3">
        <OrderingDropdown items={SHORT_URLS_ORDERABLE_FIELDS} order={actualOrderBy} onChange={handleOrderBy} />
      </div>
      <Card body className="pb-1">
        <ShortUrlsTable
          selectedServer={selectedServer}
          shortUrlsList={shortUrlsList}
          orderByColumn={orderByColumn}
          renderOrderIcon={renderOrderIcon}
          onTagClick={addTag}
        />
        <Paginator paginator={pagination} serverId={serverId} currentQueryString={location.search} />
      </Card>
    </>
  );
}, () => [ Topics.visits ]);

export default ShortUrlsList;
