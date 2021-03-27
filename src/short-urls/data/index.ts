import * as m from 'moment';
import { Nullable, OptionalString } from '../../utils/utils';

export interface EditShortUrlData {
  longUrl?: string;
  tags?: string[];
  title?: string;
  validSince?: m.Moment | string | null;
  validUntil?: m.Moment | string | null;
  maxVisits?: number | null;
  validateUrl?: boolean;
}

export interface ShortUrlData extends EditShortUrlData {
  longUrl: string;
  customSlug?: string;
  shortCodeLength?: number;
  domain?: string;
  findIfExists?: boolean;
}

export interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  dateCreated: string;
  visitsCount: number;
  meta: Required<Nullable<ShortUrlMeta>>;
  tags: string[];
  domain: string | null;
  title?: string | null;
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

export interface ShortUrlIdentifier {
  shortCode: string;
  domain: OptionalString;
}
