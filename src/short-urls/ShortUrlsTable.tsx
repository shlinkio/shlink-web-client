import { FC, ReactNode } from 'react';
import { isEmpty } from 'ramda';
import classNames from 'classnames';
import { SelectedServer } from '../servers/data';
import { supportsShortUrlTitle } from '../utils/helpers/features';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { ShortUrlsRowProps } from './helpers/ShortUrlsRow';
import { ShortUrlsOrderableFields } from './data';
import './ShortUrlsTable.scss';

export interface ShortUrlsTableProps {
  orderByColumn?: (column: ShortUrlsOrderableFields) => () => void;
  renderOrderIcon?: (column: ShortUrlsOrderableFields) => ReactNode;
  shortUrlsList: ShortUrlsListState;
  selectedServer: SelectedServer;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export const ShortUrlsTable = (ShortUrlsRow: FC<ShortUrlsRowProps>) => ({
  orderByColumn,
  renderOrderIcon,
  shortUrlsList,
  onTagClick,
  selectedServer,
  className,
}: ShortUrlsTableProps) => {
  const { error, loading, shortUrls } = shortUrlsList;
  const actionableFieldClasses = classNames({ 'short-urls-table__header-cell--with-action': !!orderByColumn });
  const orderableColumnsClasses = classNames('short-urls-table__header-cell', actionableFieldClasses);
  const tableClasses = classNames('table table-hover responsive-table', className);
  const supportsTitle = supportsShortUrlTitle(selectedServer);

  const renderShortUrls = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={6} className="text-center table-danger text-dark">
            Something went wrong while loading short URLs :(
          </td>
        </tr>
      );
    }

    if (loading) {
      return <tr><td colSpan={6} className="text-center">Loading...</td></tr>;
    }

    if (!loading && isEmpty(shortUrls?.data)) {
      return <tr><td colSpan={6} className="text-center">No results found</td></tr>;
    }

    return shortUrls?.data.map((shortUrl) => (
      <ShortUrlsRow
        key={shortUrl.shortUrl}
        shortUrl={shortUrl}
        selectedServer={selectedServer}
        onTagClick={onTagClick}
      />
    ));
  };

  return (
    <table className={tableClasses}>
      <thead className="responsive-table__header short-urls-table__header">
        <tr>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('dateCreated')}>
            Created at {renderOrderIcon?.('dateCreated')}
          </th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('shortCode')}>
            Short URL {renderOrderIcon?.('shortCode')}
          </th>
          {!supportsTitle ? (
            <th className={orderableColumnsClasses} onClick={orderByColumn?.('longUrl')}>
              Long URL {renderOrderIcon?.('longUrl')}
            </th>
          ) : (
            <th className="short-urls-table__header-cell">
              <span className={actionableFieldClasses} onClick={orderByColumn?.('title')}>
                Title {renderOrderIcon?.('title')}
              </span>
              &nbsp;&nbsp;/&nbsp;&nbsp;
              <span className={actionableFieldClasses} onClick={orderByColumn?.('longUrl')}>
                <span className="indivisible">Long URL</span> {renderOrderIcon?.('longUrl')}
              </span>
            </th>
          )}
          <th className="short-urls-table__header-cell">Tags</th>
          <th className={orderableColumnsClasses} onClick={orderByColumn?.('visits')}>
            <span className="indivisible">Visits {renderOrderIcon?.('visits')}</span>
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
