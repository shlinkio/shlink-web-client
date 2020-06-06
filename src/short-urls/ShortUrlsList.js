import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { head, isEmpty, keys, values } from 'ramda';
import React, { useState, useEffect } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { serverType } from '../servers/prop-types';
import SortingDropdown from '../utils/SortingDropdown';
import { determineOrderDir } from '../utils/utils';
import { MercureInfoType } from '../mercure/reducers/mercureInfo';
import { useMercureTopicBinding } from '../mercure/helpers';
import { shortUrlType } from './reducers/shortUrlsList';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';
import './ShortUrlsList.scss';

export const SORTABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  longUrl: 'Long URL',
  visits: 'Visits',
};

const propTypes = {
  listShortUrls: PropTypes.func,
  resetShortUrlParams: PropTypes.func,
  shortUrlsListParams: shortUrlsListParamsType,
  match: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  shortUrlsList: PropTypes.arrayOf(shortUrlType),
  selectedServer: serverType,
  createNewVisit: PropTypes.func,
  loadMercureInfo: PropTypes.func,
  mercureInfo: MercureInfoType,
};

// FIXME Replace with typescript: (ShortUrlsRow component)
const ShortUrlsList = (ShortUrlsRow) => {
  const ShortUrlsListComp = ({
    listShortUrls,
    resetShortUrlParams,
    shortUrlsListParams,
    match,
    location,
    loading,
    error,
    shortUrlsList,
    selectedServer,
    createNewVisit,
    loadMercureInfo,
    mercureInfo,
  }) => {
    const { orderBy } = shortUrlsListParams;
    const [ order, setOrder ] = useState({
      orderField: orderBy && head(keys(orderBy)),
      orderDir: orderBy && head(values(orderBy)),
    });
    const refreshList = (extraParams) => listShortUrls({ ...shortUrlsListParams, ...extraParams });
    const handleOrderBy = (orderField, orderDir) => {
      setOrder({ orderField, orderDir });
      refreshList({ orderBy: { [orderField]: orderDir } });
    };
    const orderByColumn = (columnName) => () =>
      handleOrderBy(columnName, determineOrderDir(columnName, order.orderField, order.orderDir));
    const renderOrderIcon = (field) => {
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
            <td colSpan="6" className="text-center table-danger">Something went wrong while loading short URLs :(</td>
          </tr>
        );
      }

      if (loading) {
        return <tr><td colSpan="6" className="text-center">Loading...</td></tr>;
      }

      if (!loading && isEmpty(shortUrlsList)) {
        return <tr><td colSpan="6" className="text-center">No results found</td></tr>;
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
      const { params } = match;
      const query = qs.parse(location.search, { ignoreQueryPrefix: true });
      const tags = query.tag ? [ query.tag ] : shortUrlsListParams.tags;

      refreshList({ page: params.page, tags });

      return resetShortUrlParams;
    }, []);
    useMercureTopicBinding(mercureInfo, 'https://shlink.io/new-visit', createNewVisit, loadMercureInfo);

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
  };

  ShortUrlsListComp.propTypes = propTypes;

  return ShortUrlsListComp;
};

export default ShortUrlsList;
