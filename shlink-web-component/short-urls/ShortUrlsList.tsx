import { pipe } from 'ramda';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card } from 'reactstrap';
import { DEFAULT_SHORT_URLS_ORDERING } from '../../src/settings/reducers/settings';
import type { OrderDir } from '../../src/utils/helpers/ordering';
import { determineOrderDir } from '../../src/utils/helpers/ordering';
import type { ShlinkShortUrlsListParams, ShlinkShortUrlsOrder } from '../api-contract';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import { useFeature } from '../utils/features';
import { useSettings } from '../utils/settings';
import { TableOrderIcon } from '../utils/table/TableOrderIcon';
import type { ShortUrlsOrder, ShortUrlsOrderableFields } from './data';
import { useShortUrlsQuery } from './helpers/hooks';
import { Paginator } from './Paginator';
import type { ShortUrlsList as ShortUrlsListState } from './reducers/shortUrlsList';
import type { ShortUrlsFilteringBarType } from './ShortUrlsFilteringBar';
import type { ShortUrlsTableType } from './ShortUrlsTable';

interface ShortUrlsListProps {
  shortUrlsList: ShortUrlsListState;
  listShortUrls: (params: ShlinkShortUrlsListParams) => void;
}

export const ShortUrlsList = (
  ShortUrlsTable: ShortUrlsTableType,
  ShortUrlsFilteringBar: ShortUrlsFilteringBarType,
) => boundToMercureHub(({ listShortUrls, shortUrlsList }: ShortUrlsListProps) => {
  const { page } = useParams();
  const location = useLocation();
  const [filter, toFirstPage] = useShortUrlsQuery();
  const settings = useSettings();
  const {
    tags,
    search,
    startDate,
    endDate,
    orderBy,
    tagsMode,
    excludeBots,
    excludePastValidUntil,
    excludeMaxVisitsReached,
  } = filter;
  const [actualOrderBy, setActualOrderBy] = useState(
    // This separated state handling is needed to be able to fall back to settings value, but only once when loaded
    orderBy ?? settings.shortUrlsList?.defaultOrdering ?? DEFAULT_SHORT_URLS_ORDERING,
  );
  const { pagination } = shortUrlsList?.shortUrls ?? {};
  const doExcludeBots = excludeBots ?? settings.visits?.excludeBots;
  const supportsExcludingBots = useFeature('excludeBotsOnShortUrls');
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
    if (supportsExcludingBots && doExcludeBots && field === 'visits') {
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
      excludePastValidUntil,
      excludeMaxVisitsReached,
    });
  }, [
    page,
    search,
    tags,
    startDate,
    endDate,
    actualOrderBy.field,
    actualOrderBy.dir,
    tagsMode,
    excludePastValidUntil,
    excludeMaxVisitsReached,
  ]);

  return (
    <>
      <ShortUrlsFilteringBar
        shortUrlsAmount={shortUrlsList.shortUrls?.pagination.totalItems}
        order={actualOrderBy}
        handleOrderBy={handleOrderBy}
        className="mb-3"
      />
      <Card body className="pb-0">
        <ShortUrlsTable
          shortUrlsList={shortUrlsList}
          orderByColumn={orderByColumn}
          renderOrderIcon={renderOrderIcon}
          onTagClick={addTag}
        />
        <Paginator paginator={pagination} currentQueryString={location.search} />
      </Card>
    </>
  );
}, () => [Topics.visits]);
