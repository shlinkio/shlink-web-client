import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { isEmpty, pipe } from 'ramda';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';
import { ShortUrlsOrder, ShortUrlsOrderableFields } from '../data';
import { orderToString, stringToOrder } from '../../utils/helpers/ordering';
import { TagsFilteringMode } from '../../api/types';

interface ShortUrlsQueryCommon {
  search?: string;
  startDate?: string;
  endDate?: string;
  tagsMode?: TagsFilteringMode;
}

interface ShortUrlsQuery extends ShortUrlsQueryCommon {
  orderBy?: string;
  tags?: string;
}

interface ShortUrlsFiltering extends ShortUrlsQueryCommon {
  orderBy?: ShortUrlsOrder;
  tags: string[];
}

type ToFirstPage = (extra: Partial<ShortUrlsFiltering>) => void;

export const useShortUrlsQuery = (): [ShortUrlsFiltering, ToFirstPage] => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { serverId = '' } = useParams<{ serverId: string }>();

  const filtering = useMemo(
    pipe(
      () => parseQuery<ShortUrlsQuery>(search),
      ({ orderBy, tags, ...rest }: ShortUrlsQuery): ShortUrlsFiltering => {
        const parsedOrderBy = orderBy ? stringToOrder<ShortUrlsOrderableFields>(orderBy) : undefined;
        const parsedTags = tags?.split(',') ?? [];
        return { ...rest, orderBy: parsedOrderBy, tags: parsedTags };
      },
    ),
    [search],
  );
  const toFirstPageWithExtra = (extra: Partial<ShortUrlsFiltering>) => {
    const { orderBy, tags, ...mergedFiltering } = { ...filtering, ...extra };
    const query: ShortUrlsQuery = {
      ...mergedFiltering,
      orderBy: orderBy && orderToString(orderBy),
      tags: tags.length > 0 ? tags.join(',') : undefined,
    };
    const stringifiedQuery = stringifyQuery(query);
    const queryString = isEmpty(stringifiedQuery) ? '' : `?${stringifiedQuery}`;

    navigate(`/server/${serverId}/list-short-urls/1${queryString}`);
  };

  return [filtering, toFirstPageWithExtra];
};
