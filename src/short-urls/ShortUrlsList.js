import caretDownIcon from '@fortawesome/fontawesome-free-solid/faCaretDown';
import caretUpIcon from '@fortawesome/fontawesome-free-solid/faCaretUp';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { head, isEmpty, keys, values } from 'ramda';
import React from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { serverType } from '../servers/prop-types';
import SortingDropdown from '../utils/SortingDropdown';
import { determineOrderDir } from '../utils/utils';
import { shortUrlType } from './reducers/shortUrlsList';
import { shortUrlsListParamsType } from './reducers/shortUrlsListParams';
import './ShortUrlsList.scss';

const SORTABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  originalUrl: 'Long URL',
  visits: 'Visits',
};

const ShortUrlsList = (ShortUrlsRow) => class ShortUrlsList extends React.Component {
  static propTypes = {
    listShortUrls: PropTypes.func,
    resetShortUrlParams: PropTypes.func,
    shortUrlsListParams: shortUrlsListParamsType,
    match: PropTypes.object,
    location: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    shortUrlsList: PropTypes.arrayOf(shortUrlType),
    selectedServer: serverType,
  };

  refreshList = (extraParams) => {
    const { listShortUrls, shortUrlsListParams } = this.props;

    listShortUrls({
      ...shortUrlsListParams,
      ...extraParams,
    });
  };
  handleOrderBy = (orderField, orderDir) => {
    this.setState({ orderField, orderDir });
    this.refreshList({ orderBy: { [orderField]: orderDir } });
  };
  orderByColumn = (columnName) => () =>
    this.handleOrderBy(columnName, determineOrderDir(columnName, this.state.orderField, this.state.orderDir));
  renderOrderIcon = (field) => {
    if (this.state.orderField !== field) {
      return null;
    }

    return (
      <FontAwesomeIcon
        icon={this.state.orderDir === 'ASC' ? caretUpIcon : caretDownIcon}
        className="short-urls-list__header-icon"
      />
    );
  };

  constructor(props) {
    super(props);

    const { orderBy } = props.shortUrlsListParams;

    this.state = {
      orderField: orderBy ? head(keys(orderBy)) : undefined,
      orderDir: orderBy ? head(values(orderBy)) : undefined,
    };
  }

  componentDidMount() {
    const { match: { params }, location, shortUrlsListParams } = this.props;
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });

    this.refreshList({ page: params.page, tags: query.tag ? [ query.tag ] : shortUrlsListParams.tags });
  }

  componentWillUnmount() {
    const { resetShortUrlParams } = this.props;

    resetShortUrlParams();
  }

  renderShortUrls() {
    const { shortUrlsList, selectedServer, loading, error, shortUrlsListParams } = this.props;

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
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        key={shortUrl.shortCode}
        refreshList={this.refreshList}
        shortUrlsListParams={shortUrlsListParams}
      />
    ));
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-block d-md-none mb-3">
          <SortingDropdown
            items={SORTABLE_FIELDS}
            orderField={this.state.orderField}
            orderDir={this.state.orderDir}
            onChange={this.handleOrderBy}
          />
        </div>
        <table className="table table-striped table-hover">
          <thead className="short-urls-list__header">
            <tr>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={this.orderByColumn('dateCreated')}
              >
                {this.renderOrderIcon('dateCreated')}
                Created at
              </th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={this.orderByColumn('shortCode')}
              >
                {this.renderOrderIcon('shortCode')}
                Short URL
              </th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={this.orderByColumn('originalUrl')}
              >
                {this.renderOrderIcon('originalUrl')}
                Long URL
              </th>
              <th className="short-urls-list__header-cell">Tags</th>
              <th
                className="short-urls-list__header-cell short-urls-list__header-cell--with-action"
                onClick={this.orderByColumn('visits')}
              >
                <span className="nowrap">{this.renderOrderIcon('visits')} Visits</span>
              </th>
              <th className="short-urls-list__header-cell">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.renderShortUrls()}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
};

export default ShortUrlsList;
