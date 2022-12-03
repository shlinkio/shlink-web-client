import { ShlinkVisitsParams } from '../../../api/types';
import { DateInterval } from '../../../utils/helpers/dateIntervals';
import { ProblemDetailsError } from '../../../api/types/errors';
import { Visit } from '../../types';

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
