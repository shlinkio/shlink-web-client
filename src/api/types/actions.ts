import { Action } from 'redux';
import { ProblemDetailsError } from './index';

export interface ApiErrorAction extends Action<string> {
  errorData?: ProblemDetailsError;
}
