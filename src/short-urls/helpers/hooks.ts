import { isEmpty, pipe } from 'ramda';
import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { TagsFilteringMode } from '../../api/types';
import { orderToString, stringToOrder } from '../../utils/helpers/ordering';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';
import type { BooleanString } from '../../utils/utils';
import { parseOptionalBooleanToString } from '../../utils/utils';
import type { ShortUrlsOrder, ShortUrlsOrderableFields } from '../data';

interface ShortUrlsQueryCommon {
  search?: string;
  startDate?: string;
  endDate?: string;
  tagsMode?: TagsFilteringMode;
}

interface ShortUrlsQuery extends ShortUrlsQueryCommon {
  orderBy?: string;
  tags?: string;
  excludeBots?: BooleanString;
  excludeMaxVisitsReached?: BooleanString;
  excludePastValidUntil?: BooleanString;
}

interface ShortUrlsFiltering extends ShortUrlsQueryCommon {
  orderBy?: ShortUrlsOrder;
  tags: string[];
  excludeBots?: boolean;
  excludeMaxVisitsReached?: boolean;
  excludePastValidUntil?: boolean;
}

type ToFirstPage = (extra: Partial<ShortUrlsFiltering>) => void;

export const useShortUrlsQuery = (): [ShortUrlsFiltering, ToFirstPage] => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { serverId = '' } = useParams<{ serverId: string }>();

  const filtering = useMemo(
    pipe(
      () => parseQuery<ShortUrlsQuery>(search),
      ({ orderBy, tags, excludeBots, excludeMaxVisitsReached, excludePastValidUntil, ...rest }): ShortUrlsFiltering => {
        const parsedOrderBy = orderBy ? stringToOrder<ShortUrlsOrderableFields>(orderBy) : undefined;
        const parsedTags = tags?.split(',') ?? [];
        return {
          ...rest,
          orderBy: parsedOrderBy,
          tags: parsedTags,
          excludeBots: excludeBots !== undefined ? excludeBots === 'true' : undefined,
          excludeMaxVisitsReached: excludeMaxVisitsReached !== undefined ? excludeMaxVisitsReached === 'true' : undefined,
          excludePastValidUntil: excludePastValidUntil !== undefined ? excludePastValidUntil === 'true' : undefined,
        };
      },
    ),
    [search],
  );
  const toFirstPageWithExtra = (extra: Partial<ShortUrlsFiltering>) => {
    const merged = { ...filtering, ...extra };
    const { orderBy, tags, excludeBots, excludeMaxVisitsReached, excludePastValidUntil, ...mergedFiltering } = merged;
    const query: ShortUrlsQuery = {
      ...mergedFiltering,
      orderBy: orderBy && orderToString(orderBy),
      tags: tags.length > 0 ? tags.join(',') : undefined,
      excludeBots: parseOptionalBooleanToString(excludeBots),
      excludeMaxVisitsReached: parseOptionalBooleanToString(excludeMaxVisitsReached),
      excludePastValidUntil: parseOptionalBooleanToString(excludePastValidUntil),
    };
    const stringifiedQuery = stringifyQuery(query);
    const queryString = isEmpty(stringifiedQuery) ? '' : `?${stringifiedQuery}`;

    navigate(`/server/${serverId}/list-short-urls/1${queryString}`);
  };

  return [filtering, toFirstPageWithExtra];
};
