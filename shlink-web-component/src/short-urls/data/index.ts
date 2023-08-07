import type { Order } from '@shlinkio/shlink-frontend-kit';
import type { ShlinkShortUrl } from '../../api-contract';
import type { OptionalString } from '../../utils/helpers';

export interface ShortUrlIdentifier {
  shortCode: string;
  domain?: OptionalString;
}

export interface ShortUrlModalProps {
  shortUrl: ShlinkShortUrl;
  isOpen: boolean;
  toggle: () => void;
}

export const SHORT_URLS_ORDERABLE_FIELDS = {
  dateCreated: 'Created at',
  shortCode: 'Short URL',
  longUrl: 'Long URL',
  title: 'Title',
  visits: 'Visits',
};

export type ShortUrlsOrderableFields = keyof typeof SHORT_URLS_ORDERABLE_FIELDS;

export type ShortUrlsOrder = Order<ShortUrlsOrderableFields>;

export interface ExportableShortUrl {
  createdAt: string;
  title: string;
  shortUrl: string;
  domain?: string;
  shortCode: string;
  longUrl: string;
  tags: string;
  visits: number;
}

export interface ShortUrlsFilter {
  excludeBots?: boolean;
  excludeMaxVisitsReached?: boolean;
  excludePastValidUntil?: boolean;
}
