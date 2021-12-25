import { pipe } from 'ramda';
import { FC, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Card } from 'reactstrap';
import { SortingDropdown } from '../utils/SortingDropdown';
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
import { ShortUrlListRouteParams, useShortUrlsQuery } from './helpers/hooks';
import { ShortUrlsOrderableFields, ShortUrlsOrder, SHORT_URLS_ORDERABLE_FIELDS } from './data';

interface ShortUrlsListProps extends RouteComponentProps<ShortUrlListRouteParams> {
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  settings: Settings;
}

const ShortUrlsList = (ShortUrlsTable: FC<ShortUrlsTableProps>, SearchBar: FC) => boundToMercureHub(({
  listShortUrls,
  match,
  location,
  history,
  shortUrlsList,
  selectedServer,
  settings,
}: ShortUrlsListProps) => {
  const serverId = getServerId(selectedServer);
  const initialOrderBy = settings.shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING;
  const [ order, setOrder ] = useState<ShortUrlsOrder>(initialOrderBy);
  const [{ tags, search, startDate, endDate }, toFirstPage ] = useShortUrlsQuery({ history, match, location });
  const selectedTags = useMemo(() => tags?.split(',') ?? [], [ tags ]);
  const { pagination } = shortUrlsList?.shortUrls ?? {};

  const handleOrderBy = (field?: ShortUrlsOrderableFields, dir?: OrderDir) => setOrder({ field, dir });
  const orderByColumn = (field: ShortUrlsOrderableFields) => () =>
    handleOrderBy(field, determineOrderDir(field, order.field, order.dir));
  const renderOrderIcon = (field: ShortUrlsOrderableFields) => <TableOrderIcon currentOrder={order} field={field} />;
  const addTag = pipe(
    (newTag: string) => [ ...new Set([ ...selectedTags, newTag ]) ].join(','),
    (tags) => toFirstPage({ tags }),
  );

  useEffect(() => {
    listShortUrls({
      page: match.params.page,
      searchTerm: search,
      tags: selectedTags,
      itemsPerPage: undefined,
      startDate,
      endDate,
      orderBy: order,
    });
  }, [ match.params.page, search, selectedTags, startDate, endDate, order ]);

  return (
    <>
      <div className="mb-3"><SearchBar /></div>
      <div className="d-block d-lg-none mb-3">
        <SortingDropdown items={SHORT_URLS_ORDERABLE_FIELDS} order={order} onChange={handleOrderBy} />
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
