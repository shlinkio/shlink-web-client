import { ShortUrl } from '../../short-urls/data';
import { DateRange } from '../../utils/helpers/dateIntervals';

export type OrphanVisitType = 'base_url' | 'invalid_short_url' | 'regular_404';

interface VisitLocation {
  countryCode: string | null;
  countryName: string | null;
  regionName: string | null;
  cityName: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  isEmpty: boolean;
}

export interface RegularVisit {
  referer: string;
  date: string;
  userAgent: string;
  visitLocation: VisitLocation | null;
  potentialBot: boolean;
}

export interface OrphanVisit extends RegularVisit {
  visitedUrl: string;
  type: OrphanVisitType;
}

export type Visit = RegularVisit | OrphanVisit;

export interface UserAgent {
  browser: string;
  os: string;
}

export interface NormalizedRegularVisit extends UserAgent {
  date: string;
  referer: string;
  country: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  potentialBot: boolean;
}

export interface NormalizedOrphanVisit extends NormalizedRegularVisit {
  visitedUrl: string;
  type: OrphanVisitType;
}

export type NormalizedVisit = NormalizedRegularVisit | NormalizedOrphanVisit;

export interface CreateVisit {
  shortUrl?: ShortUrl;
  visit: Visit;
}

export type Stats = Record<string, number>;

export type StatsRow = [string, number];

export interface CityStats {
  cityName: string;
  count: number;
  latLong: [number, number];
}

export interface VisitsStats {
  os: Stats;
  browsers: Stats;
  referrers: Stats;
  countries: Stats;
  cities: Stats;
  citiesForMap: Record<string, CityStats>;
  visitedUrls: Stats;
}

export interface VisitsFilter {
  orphanVisitsType?: OrphanVisitType | undefined;
  excludeBots?: boolean;
}

export interface VisitsParams {
  page?: number;
  itemsPerPage?: number;
  dateRange?: DateRange;
  filter?: VisitsFilter;
}
