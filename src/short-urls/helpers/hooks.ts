import { RouteChildrenProps } from 'react-router-dom';
import { useMemo } from 'react';
import { isEmpty } from 'ramda';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';

type ServerIdRouteProps = RouteChildrenProps<{ serverId: string }>;
type ToFirstPage = (extra: Partial<ShortUrlsQuery>) => void;

export interface ShortUrlListRouteParams {
  page: string;
  serverId: string;
}

interface ShortUrlsQuery {
  tags?: string;
  search?: string;
}

export const useShortUrlsQuery = ({ history, location, match }: ServerIdRouteProps): [ShortUrlsQuery, ToFirstPage] => {
  const query = useMemo(() => parseQuery<ShortUrlsQuery>(location.search), [ location ]);
  const toFirstPageWithExtra = (extra: Partial<ShortUrlsQuery>) => {
    const evolvedQuery = stringifyQuery({ ...query, ...extra });
    const queryString = isEmpty(evolvedQuery) ? '' : `?${evolvedQuery}`;

    history.push(`/server/${match?.params.serverId}/list-short-urls/1${queryString}`);
  };

  return [ query, toFirstPageWithExtra ];
};
