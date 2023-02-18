import type { ShlinkDomain } from '../../api/types';

export type DomainStatus = 'validating' | 'valid' | 'invalid';

export interface Domain extends ShlinkDomain {
  status: DomainStatus;
}
