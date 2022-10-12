import { Action } from 'redux';
import { ProblemDetailsError } from './errors';

export interface ApiErrorAction extends Action<string> {
  errorData?: ProblemDetailsError;
}
