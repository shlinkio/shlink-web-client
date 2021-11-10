import { head, keys, pipe, values } from 'ramda';
import { FC, useEffect, useMemo, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Card } from 'reactstrap';
import SortingDropdown from '../utils/SortingDropdown';
import { determineOrderDir, Order, OrderDir } from '../utils/helpers/ordering';
import { getServerId, SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { TableOrderIcon } from '../utils/table/TableOrderIcon';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { OrderableFields, ShortUrlsListParams, SORTABLE_FIELDS } from './reducers/shortUrlsListParams';
import { ShortUrlsTableProps } from './ShortUrlsTable';
import Paginator from './Paginator';
import { ShortUrlListRouteParams, useShortUrlsQuery } from './helpers/hooks';

interface ShortUrlsListProps extends RouteComponentProps<ShortUrlListRouteParams> {
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShortUrlsListParams) => void;
  shortUrlsListParams: ShortUrlsListParams;
  resetShortUrlParams: () => void;
}

type ShortUrlsOrder = Order<OrderableFields>;

const ShortUrlsList = (ShortUrlsTable: FC<ShortUrlsTableProps>, SearchBar: FC) => boundToMercureHub(({
  listShortUrls,
  resetShortUrlParams,
  shortUrlsListParams,
  match,
  location,
  history,
  shortUrlsList,
  selectedServer,
}: ShortUrlsListProps) => {
  const serverId = getServerId(selectedServer);
  const { orderBy } = shortUrlsListParams;
  const [ order, setOrder ] = useState<ShortUrlsOrder>({
    field: orderBy && (head(keys(orderBy)) as OrderableFields),
    dir: orderBy && head(values(orderBy)),
  });
  const [{ tags, search, startDate, endDate }, toFirstPage ] = useShortUrlsQuery({ history, match, location });
  const selectedTags = useMemo(() => tags?.split(',') ?? [], [ tags ]);
  const { pagination } = shortUrlsList?.shortUrls ?? {};

  const refreshList = (extraParams: ShortUrlsListParams) => listShortUrls({ ...shortUrlsListParams, ...extraParams });
  const handleOrderBy = (field?: OrderableFields, dir?: OrderDir) => {
    setOrder({ field, dir });
    refreshList({ orderBy: field ? { [field]: dir } : undefined });
  };
  const orderByColumn = (field: OrderableFields) => () =>
    handleOrderBy(field, determineOrderDir(field, order.field, order.dir));
  const renderOrderIcon = (field: OrderableFields) => <TableOrderIcon currentOrder={order} field={field} />;
  const addTag = pipe(
    (newTag: string) => [ ...new Set([ ...selectedTags, newTag ]) ].join(','),
    (tags) => toFirstPage({ tags }),
  );

  useEffect(() => resetShortUrlParams, []);
  useEffect(() => {
    refreshList(
      { page: match.params.page, searchTerm: search, tags: selectedTags, itemsPerPage: undefined, startDate, endDate },
    );
  }, [ match.params.page, search, selectedTags, startDate, endDate ]);

  return (
    <>
      <div className="mb-3"><SearchBar /></div>
      <div className="d-block d-lg-none mb-3">
        <SortingDropdown items={SORTABLE_FIELDS} order={order} onChange={handleOrderBy} />
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
