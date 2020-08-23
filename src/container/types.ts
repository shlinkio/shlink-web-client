import { MercureInfo } from '../mercure/reducers/mercureInfo';

export type ConnectDecorator = (props: string[], actions?: string[]) => any;

export interface ShlinkState {
  servers: any;
  selectedServer: any;
  shortUrlsList: any;
  shortUrlsListParams: any;
  shortUrlCreationResult: any;
  shortUrlDeletion: any;
  shortUrlTags: any;
  shortUrlMeta: any;
  shortUrlEdition: any;
  shortUrlVisits: any;
  tagVisits: any;
  shortUrlDetail: any;
  tagsList: any;
  tagDelete: any;
  tagEdit: any;
  mercureInfo: MercureInfo;
  settings: any;
}

export type GetState = () => ShlinkState;
