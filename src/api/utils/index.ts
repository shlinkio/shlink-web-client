import { AxiosError } from 'axios';
import { ProblemDetailsError } from '../../utils/services/types';

export const parseApiError = (e: AxiosError<ProblemDetailsError>) => e.response?.data;
