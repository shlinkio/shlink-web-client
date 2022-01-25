import { AxiosError } from 'axios';
import { InvalidArgumentError, InvalidShortUrlDeletion, ProblemDetailsError } from '../types';

export const parseApiError = (e: AxiosError<ProblemDetailsError>) => e.response?.data;

export const isInvalidArgumentError = (error?: ProblemDetailsError): error is InvalidArgumentError =>
  error?.type === 'INVALID_ARGUMENT';

export const isInvalidDeletionError = (error?: ProblemDetailsError): error is InvalidShortUrlDeletion =>
  error?.type === 'INVALID_SHORTCODE_DELETION' || error?.type === 'INVALID_SHORT_URL_DELETION';
