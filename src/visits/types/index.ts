import { Action } from 'redux';
import { ShortUrl } from '../../short-urls/data';

export interface VisitsInfo {
  visits: Visit[];
  loading: boolean;
  loadingLarge: boolean;
  error: boolean;
  progress: number;
  cancelLoad: boolean;
}

export interface VisitsLoadProgressChangedAction extends Action<string> {
  progress: number;
}

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

export interface Visit {
  referer: string;
  date: string;
  userAgent: string;
  visitLocation: VisitLocation | null;
}

export interface UserAgent {
  browser: string;
  os: string;
}

export interface NormalizedVisit extends UserAgent {
  date: string;
  referer: string;
  country: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CreateVisit {
  shortUrl: ShortUrl;
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
}
