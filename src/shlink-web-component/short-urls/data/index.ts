import type { ShlinkVisitsSummary } from '../../../api/types';
import type { Order } from '../../../utils/helpers/ordering';
import type { Nullable, OptionalString } from '../../../utils/utils';

export interface DeviceLongUrls {
  android?: OptionalString;
  ios?: OptionalString;
  desktop?: OptionalString;
}

export interface EditShortUrlData {
  longUrl?: string;
  deviceLongUrls?: DeviceLongUrls;
  tags?: string[];
  title?: string | null;
  validSince?: Date | string | null;
  validUntil?: Date | string | null;
  maxVisits?: number | null;
  validateUrl?: boolean;
  crawlable?: boolean;
  forwardQuery?: boolean;
}

export interface ShortUrlData extends EditShortUrlData {
  longUrl: string;
  customSlug?: string;
  shortCodeLength?: number;
  domain?: string;
  findIfExists?: boolean;
}

export interface ShortUrlIdentifier {
  shortCode: string;
  domain?: OptionalString;
}

export interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  deviceLongUrls?: Required<DeviceLongUrls>, // Optional only before Shlink 3.5.0
  dateCreated: string;
  /** @deprecated */
  visitsCount: number; // Deprecated since Shlink 3.4.0
  visitsSummary?: ShlinkVisitsSummary; // Optional only before Shlink 3.4.0
  meta: Required<Nullable<ShortUrlMeta>>;
  tags: string[];
  domain: string | null;
  title?: string | null;
  crawlable?: boolean;
  forwardQuery?: boolean;
}

export interface ShortUrlMeta {
  validSince?: string;
  validUntil?: string;
  maxVisits?: number;
}

export interface ShortUrlModalProps {
  shortUrl: ShortUrl;
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
