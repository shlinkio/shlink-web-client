import { pipe } from 'ramda';
import { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import { useLocation, useParams } from 'react-router-dom';
import { determineOrderDir, OrderDir } from '../utils/helpers/ordering';
import { getServerId, SelectedServer } from '../servers/data';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { TableOrderIcon } from '../utils/table/TableOrderIcon';
import { ShlinkShortUrlsListParams, ShlinkShortUrlsOrder } from '../api/types';
import { DEFAULT_SHORT_URLS_ORDERING, Settings } from '../settings/reducers/settings';
import { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import { ShortUrlsTableType } from './ShortUrlsTable';
import { Paginator } from './Paginator';
import { useShortUrlsQuery } from './helpers/hooks';
import { ShortUrlsOrder, ShortUrlsOrderableFields } from './data';
import { ShortUrlsFilteringBarType } from './ShortUrlsFilteringBar';
import { supportsExcludeBotsOnShortUrls } from '../utils/helpers/features';

interface ShortUrlsListProps {
  selectedServer: SelectedServer;
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
  settings: Settings;
}

export const ShortUrlsList = (
  ShortUrlsTable: ShortUrlsTableType,
  ShortUrlsFilteringBar: ShortUrlsFilteringBarType,
) => boundToMercureHub(({ listShortUrls, shortUrlsList, selectedServer, settings }: ShortUrlsListProps) => {
  const serverId = getServerId(selectedServer);
  const { page } = useParams();
  const location = useLocation();
  const [{ tags, search, startDate, endDate, orderBy, tagsMode, excludeBots }, toFirstPage] = useShortUrlsQuery();
  const [actualOrderBy, setActualOrderBy] = useState(
    // This separated state handling is needed to be able to fall back to settings value, but only once when loaded
    orderBy ?? settings.shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING,
  );
  const { pagination } = shortUrlsList?.shortUrls ?? {};
  const doExcludeBots = excludeBots ?? settings.visits?.excludeBots;
  const handleOrderBy = (field?: ShortUrlsOrderableFields, dir?: OrderDir) => {
    toFirstPage({ orderBy: { field, dir } });
    setActualOrderBy({ field, dir });
  };
  const orderByColumn = (field: ShortUrlsOrderableFields) => () =>
    handleOrderBy(field, determineOrderDir(field, actualOrderBy.field, actualOrderBy.dir));
  const renderOrderIcon = (field: ShortUrlsOrderableFields) =>
    <TableOrderIcon currentOrder={actualOrderBy} field={field} />;
  const addTag = pipe(
    (newTag: string) => [...new Set([...tags, newTag])],
    (updatedTags) => toFirstPage({ tags: updatedTags }),
  );
  const parseOrderByForShlink = ({ field, dir }: ShortUrlsOrder): ShlinkShortUrlsOrder => {
    if (supportsExcludeBotsOnShortUrls(selectedServer) && doExcludeBots && field === 'visits') {
      return { field: 'nonBotVisits', dir };
    }

    return { field, dir };
  };

  useEffect(() => {
    listShortUrls({
      page,
      searchTerm: search,
      tags,
      startDate,
      endDate,
      orderBy: parseOrderByForShlink(actualOrderBy),
      tagsMode,
    });
  }, [page, search, tags, startDate, endDate, actualOrderBy.field, actualOrderBy.dir, tagsMode]);

  return (
    <>
      <ShortUrlsFilteringBar
        selectedServer={selectedServer}
        shortUrlsAmount={shortUrlsList.shortUrls?.pagination.totalItems}
        order={actualOrderBy}
        handleOrderBy={handleOrderBy}
        settings={settings}
        className="mb-3"
      />
      <Card body className="pb-0">
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
}, () => [Topics.visits]);
