import type { Order } from '@shlinkio/shlink-frontend-kit';
import type { ShlinkShortUrlData, ShlinkVisitsSummary } from '../../api-contract';
import type { Nullable, OptionalString } from '../../utils/helpers';

export interface ShortUrlData extends Omit<ShlinkShortUrlData, 'deviceLongUrls'> {
  longUrl: string;
  customSlug?: string;
  shortCodeLength?: number;
  domain?: string;
  findIfExists?: boolean;
  deviceLongUrls?: {
    android?: string;
    ios?: string;
    desktop?: string;
  }
}

export interface ShlinkDeviceLongUrls {
  android?: OptionalString;
  ios?: OptionalString;
  desktop?: OptionalString;
}

export interface ShlinkShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  deviceLongUrls?: Required<ShlinkDeviceLongUrls>, // Optional only before Shlink 3.5.0
  dateCreated: string;
  /** @deprecated */
  visitsCount: number; // Deprecated since Shlink 3.4.0
  visitsSummary?: ShlinkVisitsSummary; // Optional only before Shlink 3.4.0
  meta: Required<Nullable<ShlinkShortUrlMeta>>;
  tags: string[];
  domain: string | null;
  title?: string | null;
  crawlable?: boolean;
  forwardQuery?: boolean;
}

export interface ShlinkShortUrlMeta {
  validSince?: string;
  validUntil?: string;
  maxVisits?: number;
}

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
