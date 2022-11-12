import { PayloadAction } from '@reduxjs/toolkit';
import { ShlinkVisitsParams } from '../../../api/types';
import { DateInterval } from '../../../utils/dates/types';
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

export type VisitsLoadProgressChangedAction = PayloadAction<number>;

export type VisitsFallbackIntervalAction = PayloadAction<DateInterval>;
