import type { ProblemDetailsError } from '../shlink-web-component/api-contract';
import { isInvalidArgumentError } from '../shlink-web-component/api-contract/utils';

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
