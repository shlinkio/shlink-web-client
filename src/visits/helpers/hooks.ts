import { DeepPartial } from '@reduxjs/toolkit';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { isEmpty, mergeDeepRight, pipe } from 'ramda';
import { DateRange, datesToDateRange } from '../../utils/dates/types';
import { OrphanVisitType, VisitsFilter } from '../types';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';
import { formatIsoDate } from '../../utils/helpers/date';

interface VisitsQuery {
  startDate?: string;
  endDate?: string;
  orphanVisitsType?: OrphanVisitType;
  excludeBots?: 'true';
}

interface VisitsFiltering {
  dateRange?: DateRange;
  visitsFilter: VisitsFilter;
}

type UpdateFiltering = (extra: DeepPartial<VisitsFiltering>) => void;

export const useVisitsQuery = (): [VisitsFiltering, UpdateFiltering] => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const filtering = useMemo(
    pipe(
      () => parseQuery<VisitsQuery>(search),
      ({ startDate, endDate, orphanVisitsType, excludeBots }: VisitsQuery): VisitsFiltering => ({
        dateRange: startDate || endDate ? datesToDateRange(startDate, endDate) : undefined,
        visitsFilter: { orphanVisitsType, excludeBots: excludeBots === 'true' },
      }),
    ),
    [search],
  );
  const updateFiltering = (extra: DeepPartial<VisitsFiltering>) => {
    const { dateRange, visitsFilter } = mergeDeepRight(filtering, extra);
    const query: VisitsQuery = {
      startDate: (dateRange?.startDate && formatIsoDate(dateRange.startDate)) || undefined,
      endDate: (dateRange?.endDate && formatIsoDate(dateRange.endDate)) || undefined,
      excludeBots: visitsFilter.excludeBots ? 'true' : undefined,
      orphanVisitsType: visitsFilter.orphanVisitsType,
    };
    const stringifiedQuery = stringifyQuery(query);
    const queryString = isEmpty(stringifiedQuery) ? '' : `?${stringifiedQuery}`;

    navigate(queryString, { replace: true, relative: 'route' });
  };

  return [filtering, updateFiltering];
};
