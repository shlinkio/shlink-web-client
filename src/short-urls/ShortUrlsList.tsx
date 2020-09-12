import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { head, isEmpty, keys, values } from 'ramda';
import React, { FC, useEffect, useState } from 'react';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';
import SortingDropdown from '../utils/SortingDropdown';
import { determineOrderDir, OrderDir } from '../utils/utils';
import { SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { ShortUrlsRowProps } from './helpers/ShortUrlsRow';
import { ShortUrl } from './data';
import { OrderableFields, ShortUrlsListParams, SORTABLE_FIELDS } from './reducers/shortUrlsListParams';
import './ShortUrlsList.scss';

interface RouteParams {
  page: string;
  serverId: string;
}

export interface WithList {
  shortUrlsList: ShortUrl[];
}

export interface ShortUrlsListProps extends ShortUrlsListState, RouteComponentProps<RouteParams> {
  selectedServer: SelectedServer;
  listShortUrls: (params: ShortUrlsListParams) => void;
  shortUrlsListParams: ShortUrlsListParams;
  resetShortUrlParams: () => void;
}

const ShortUrlsList = (ShortUrlsRow: FC<ShortUrlsRowProps>) => boundToMercureHub(({
  listShortUrls,
  resetShortUrlParams,
  shortUrlsListParams,
  match,
  location,
  loading,
  error,
  shortUrlsList,
  selectedServer,
}: ShortUrlsListProps & WithList) => {
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
  const renderShortUrls = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={6} className="text-center table-danger">Something went wrong while loading short URLs :(</td>
        </tr>
      );
    }

    if (loading) {
      return <tr><td colSpan={6} className="text-center">Loading...</td></tr>;
    }

    if (!loading && isEmpty(shortUrlsList)) {
      return <tr><td colSpan={6} className="text-center">No results found</td></tr>;
    }

    return shortUrlsList.map((shortUrl) => (
      <ShortUrlsRow
        key={shortUrl.shortUrl}
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        refreshList={refreshList}
        shortUrlsListParams={shortUrlsListParams}
      />
    ));
  };

  useEffect(() => {
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const tags = query.tag ? [ query.tag as string ] : shortUrlsListParams.tags;

    refreshList({ page: match.params.page, tags });

    return resetShortUrlParams;
  }, []);

  return (
    <React.Fragment>
      <div className="d-block d-md-none mb-3">
        <SortingDropdown
          items={SORTABLE_FIELDS}
          orderField={order.orderField}
          orderDir={order.orderDir}
          onChange={handleOrderBy}
        />
      </div>
      <table className="table table-striped table-hover">
        <thead className="short-urls-list__header">
          <tr>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={orderByColumn('dateCreated')}
            >
              {renderOrderIcon('dateCreated')}
              Created at
            </th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={orderByColumn('shortCode')}
            >
              {renderOrderIcon('shortCode')}
              Short URL
            </th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={orderByColumn('longUrl')}
            >
              {renderOrderIcon('longUrl')}
              Long URL
            </th>
            <th className="short-urls-list__header-cell">Tags</th>
            <th
              className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
              onClick={orderByColumn('visits')}
            >
              <span className="indivisible">{renderOrderIcon('visits')} Visits</span>
            </th>
            <th className="short-urls-list__header-cell">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {renderShortUrls()}
        </tbody>
      </table>
    </React.Fragment>
  );
}, () => 'https://shlink.io/new-visit');

export default ShortUrlsList;
