import { FC, ReactNode } from 'react';
import { isEmpty } from 'ramda';
import classNames from 'classnames';
import { SelectedServer } from '../servers/data';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { ShortUrlsRowProps } from './helpers/ShortUrlsRow';
import { OrderableFields, ShortUrlsListParams } from './reducers/shortUrlsListParams';
import './ShortUrlsTable.scss';

export interface ShortUrlsTableProps {
  orderByColumn?: (column: OrderableFields) => () => void;
  renderOrderIcon?: (column: OrderableFields) => ReactNode;
  shortUrlsList: ShortUrlsListState;
  selectedServer: SelectedServer;
  refreshList?: Function;
  shortUrlsListParams?: ShortUrlsListParams;
  className?: string;
}

export const ShortUrlsTable = (ShortUrlsRow: FC<ShortUrlsRowProps>) => ({
  orderByColumn,
  renderOrderIcon,
  shortUrlsList,
  refreshList,
  shortUrlsListParams,
  selectedServer,
  className,
}: ShortUrlsTableProps) => {
  const { error, loading, shortUrls } = shortUrlsList;
  const orderableColumnsClasses = classNames('short-urls-table__header-cell', {
    'short-urls-table__header-cell--with-action': !!orderByColumn,
  });
  const tableClasses = classNames('table table-striped table-hover', className);

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

    return shortUrls?.data.map((shortUrl) => (
      <ShortUrlsRow
        key={shortUrl.shortUrl}
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        refreshList={refreshList}
        shortUrlsListParams={shortUrlsListParams}
      />
    ));
  };

  return (
    <table className={tableClasses}>
      <thead className="short-urls-table__header">
        <tr>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('dateCreated')}>
            {renderOrderIcon?.('dateCreated')}
            Created at
          </th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('shortCode')}>
            {renderOrderIcon?.('shortCode')}
            Short URL
          </th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('longUrl')}>
            {renderOrderIcon?.('longUrl')}
            Long URL
          </th>
          <th className="short-urls-table__header-cell">Tags</th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('visits')}>
            <span className="indivisible">{renderOrderIcon?.('visits')} Visits</span>
          </th>
          <th className="short-urls-table__header-cell">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {renderShortUrls()}
      </tbody>
    </table>
  );
};
