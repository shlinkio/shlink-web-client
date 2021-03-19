import * as m from 'moment';
import { Nullable, OptionalString } from '../../utils/utils';

export interface ShortUrlData {
  longUrl: string;
  tags?: string[];
  customSlug?: string;
  title?: string;
  shortCodeLength?: number;
  domain?: string;
  validSince?: m.Moment | string;
  validUntil?: m.Moment | string;
  maxVisits?: number;
  findIfExists?: boolean;
  validateUrl?: boolean;
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
