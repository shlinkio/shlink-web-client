import { RegularServer } from '../../servers/data';
import { GetState } from '../../container/types';
import ShlinkApiClient from './ShlinkApiClient';

// FIXME Move to ShlinkApiClientBuilder
export type ShlinkApiClientBuilder = (getStateOrSelectedServer: RegularServer | GetState) => ShlinkApiClient;

export interface ShlinkMercureInfo {
  token: string;
  mercureHubUrl: string;
}
