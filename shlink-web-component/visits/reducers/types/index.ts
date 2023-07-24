import type { DateInterval } from '../../../../src/utils/helpers/dateIntervals';
import type { ProblemDetailsError, ShlinkVisitsParams } from '../../../api-contract';
import type { Visit } from '../../types';

export interface VisitsInfo {
  visits: Visit[];
  loading: boolean;
  loadingLarge: boolean;
  error: boolean;
  errorData?: ProblemDetailsError;
  progress: number;
  cancelLoad: boolean;
  query?: ShlinkVisitsParams;
  fallbackInterval?: DateInterval;
}

export interface LoadVisits {
  query?: ShlinkVisitsParams;
  doIntervalFallback?: boolean;
}

export type VisitsLoaded<T = {}> = T & {
  visits: Visit[];
  query?: ShlinkVisitsParams;
};
