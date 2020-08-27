import { Nullable, OptionalString } from '../../utils/utils';

export interface ShortUrlData {
  longUrl: string;
  tags?: string[];
  customSlug?: string;
  shortCodeLength?: number;
  domain?: string;
  validSince?: string;
  validUntil?: string;
  maxVisits?: number;
  findIfExists?: boolean;
}

export interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
  visitsCount: number;
  meta: Required<Nullable<ShortUrlMeta>>;
  tags: string[];
  domain: string | null;
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
