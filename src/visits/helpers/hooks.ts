import { DeepPartial } from '@reduxjs/toolkit';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { isEmpty, isNil, mergeDeepRight, pipe } from 'ramda';
import { DateRange, datesToDateRange } from '../../utils/helpers/dateIntervals';
import { OrphanVisitType, VisitsFilter } from '../types';
import { parseQuery, stringifyQuery } from '../../utils/helpers/query';
import { formatIsoDate } from '../../utils/helpers/date';
import { BooleanString, parseBooleanToString } from '../../utils/utils';

interface VisitsQuery {
  startDate?: string;
  endDate?: string;
  orphanVisitsType?: OrphanVisitType;
  excludeBots?: BooleanString;
  domain?: string;
}

interface VisitsFiltering {
  dateRange?: DateRange;
  visitsFilter: VisitsFilter;
}

interface VisitsFilteringAndDomain {
  filtering: VisitsFiltering;
  domain?: string;
}

type UpdateFiltering = (extra: DeepPartial<VisitsFiltering>) => void;

export const useVisitsQuery = (): [VisitsFiltering, UpdateFiltering] => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const { filtering, domain: theDomain } = useMemo(
    pipe(
      () => parseQuery<VisitsQuery>(search),
      ({ startDate, endDate, orphanVisitsType, excludeBots, domain }: VisitsQuery): VisitsFilteringAndDomain => ({
        domain,
        filtering: {
          dateRange: startDate != null || endDate != null ? datesToDateRange(startDate, endDate) : undefined,
          visitsFilter: { orphanVisitsType, excludeBots: !isNil(excludeBots) ? excludeBots === 'true' : undefined },
        },
      }),
    ),
    [search],
  );
  const updateFiltering = (extra: DeepPartial<VisitsFiltering>) => {
    const { dateRange, visitsFilter } = mergeDeepRight(filtering, extra);
    const { excludeBots, orphanVisitsType } = visitsFilter;
    const query: VisitsQuery = {
      startDate: (dateRange?.startDate && formatIsoDate(dateRange.startDate)) || '',
      endDate: (dateRange?.endDate && formatIsoDate(dateRange.endDate)) || '',
      excludeBots: excludeBots === undefined ? undefined : parseBooleanToString(excludeBots),
      orphanVisitsType,
      domain: theDomain,
    };
    const stringifiedQuery = stringifyQuery(query);
    const queryString = isEmpty(stringifiedQuery) ? '' : `?${stringifiedQuery}`;

    navigate(queryString, { replace: true, relative: 'route' });
  };

  return [filtering, updateFiltering];
};
