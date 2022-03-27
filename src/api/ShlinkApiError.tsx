import { ProblemDetailsError } from './types';
import { isInvalidArgumentError } from './utils';

export interface ShlinkApiErrorProps {
  errorData?: ProblemDetailsError;
  fallbackMessage?: string;
}

export const ShlinkApiError = ({ errorData, fallbackMessage }: ShlinkApiErrorProps) => (
  <>
    {errorData?.detail ?? fallbackMessage}
    {isInvalidArgumentError(errorData) && (
      <p className="mb-0">
        Invalid elements: [{errorData.invalidElements.join(', ')}]
      </p>
    )}
  </>
);
