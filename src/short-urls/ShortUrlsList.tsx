import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { head, keys, values } from 'ramda';
import { FC, useEffect, useState } from 'react';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';
import SortingDropdown from '../utils/SortingDropdown';
import { determineOrderDir, OrderDir } from '../utils/utils';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { OrderableFields, ShortUrlsListParams, SORTABLE_FIELDS } from './reducers/shortUrlsListParams';
import { ShortUrlsTableProps } from './ShortUrlsTable';
import './ShortUrlsList.scss';

interface RouteParams {
  page: string;
  serverId: string;
}

export interface ShortUrlsListProps extends RouteComponentProps<RouteParams> {
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShortUrlsListParams) => void;
  shortUrlsListParams: ShortUrlsListParams;
  resetShortUrlParams: () => void;
}

const ShortUrlsList = (ShortUrlsTable: FC<ShortUrlsTableProps>) => boundToMercureHub(({
  listShortUrls,
  resetShortUrlParams,
  shortUrlsListParams,
  match,
  location,
  shortUrlsList,
  selectedServer,
}: ShortUrlsListProps) => {
  const { orderBy } = shortUrlsListParams;
  const [ order, setOrder ] = useState<{ orderField?: OrderableFields; orderDir?: OrderDir }>({
    orderField: orderBy && (head(keys(orderBy)) as OrderableFields),
    orderDir: orderBy && head(values(orderBy)),
  });
  const refreshList = (extraParams: ShortUrlsListParams) => listShortUrls({ ...shortUrlsListParams, ...extraParams });
  const handleOrderBy = (orderField?: OrderableFields, orderDir?: OrderDir) => {
    setOrder({ orderField, orderDir });
    refreshList({ orderBy: orderField ? { [orderField]: orderDir } : undefined });
  };
  const orderByColumn = (field: OrderableFields) => () =>
    handleOrderBy(field, determineOrderDir(field, order.orderField, order.orderDir));
  const renderOrderIcon = (field: OrderableFields) => {
    if (order.orderField !== field) {
      return null;
    }

    if (!order.orderDir) {
      return null;
    }

    return (
      <FontAwesomeIcon
        icon={order.orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
        className="short-urls-list__header-icon"
      />
    );
  };

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const tags = query.tag ? [ query.tag as string ] : shortUrlsListParams.tags;

    refreshList({ page: match.params.page, tags, itemsPerPage: undefined });

    return resetShortUrlParams;
  }, []);

  return (
    <>
      <div className="d-block d-md-none mb-3">
        <SortingDropdown
          items={SORTABLE_FIELDS}
          orderField={order.orderField}
          orderDir={order.orderDir}
          onChange={handleOrderBy}
        />
      </div>
      <ShortUrlsTable
        orderByColumn={orderByColumn}
        renderOrderIcon={renderOrderIcon}
        selectedServer={selectedServer}
        refreshList={refreshList}
        shortUrlsListParams={shortUrlsListParams}
        shortUrlsList={shortUrlsList}
      />
    </>
  );
}, () => 'https://shlink.io/new-visit');

export default ShortUrlsList;
