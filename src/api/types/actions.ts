import { Action } from 'redux';
import { ProblemDetailsError } from './errors';

/** @deprecated */
export interface ApiErrorAction extends Action<string> {
  errorData?: ProblemDetailsError;
}
