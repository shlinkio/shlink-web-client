import { isNil, map } from 'ramda';
import { extractDomain, parseUserAgent } from '../../utils/helpers/visits';
import { hasValue } from '../../utils/utils';
import { CityStats, NormalizedVisit, Stats, Visit, VisitsStats } from '../types';
import { isNormalizedOrphanVisit, isOrphanVisit } from '../types/helpers';

/* eslint-disable no-param-reassign */
const visitHasProperty = (visit: NormalizedVisit, propertyName: keyof NormalizedVisit) =>
  !isNil(visit) && hasValue(visit[propertyName]);

const optionalNumericToNumber = (numeric: string | number | null | undefined): number => {
  if (typeof numeric === 'number') {
    return numeric;
  }

  return numeric ? parseFloat(numeric) : 0;
};

const updateOsStatsForVisit = (osStats: Stats, { os }: NormalizedVisit) => {
  osStats[os] = (osStats[os] || 0) + 1;
};

const updateBrowsersStatsForVisit = (browsersStats: Stats, { browser }: NormalizedVisit) => {
  browsersStats[browser] = (browsersStats[browser] || 0) + 1;
};

const updateReferrersStatsForVisit = (referrersStats: Stats, { referer: domain }: NormalizedVisit) => {
  referrersStats[domain] = (referrersStats[domain] || 0) + 1;
};

const updateLocationsStatsForVisit = (propertyName: 'country' | 'city') => (stats: Stats, visit: NormalizedVisit) => {
  const hasLocationProperty = visitHasProperty(visit, propertyName);
  const value = hasLocationProperty ? visit[propertyName] : 'Unknown';

  stats[value] = (stats[value] || 0) + 1;
};

const updateCountriesStatsForVisit = updateLocationsStatsForVisit('country');
const updateCitiesStatsForVisit = updateLocationsStatsForVisit('city');

const updateCitiesForMapForVisit = (citiesForMapStats: Record<string, CityStats>, visit: NormalizedVisit) => {
  if (!visitHasProperty(visit, 'city') || visit.city === 'Unknown') {
    return;
  }

  const { city, latitude, longitude } = visit;
  const currentCity = citiesForMapStats[city] || {
    cityName: city,
    count: 0,
    latLong: [optionalNumericToNumber(latitude), optionalNumericToNumber(longitude)],
  };

  currentCity.count += 1;

  citiesForMapStats[city] = currentCity;
};

const updateVisitedUrlsForVisit = (visitedUrlsStats: Stats, visit: NormalizedVisit) => {
  if (!isNormalizedOrphanVisit(visit)) {
    return;
  }

  const { visitedUrl } = visit;

  visitedUrlsStats[visitedUrl] = (visitedUrlsStats[visitedUrl] || 0) + 1;
};

export const processStatsFromVisits = (visits: NormalizedVisit[]) => visits.reduce(
  (stats: VisitsStats, visit: NormalizedVisit) => {
    // We mutate the original object because it has a big performance impact when large data sets are processed
    updateOsStatsForVisit(stats.os, visit);
    updateBrowsersStatsForVisit(stats.browsers, visit);
    updateReferrersStatsForVisit(stats.referrers, visit);
    updateCountriesStatsForVisit(stats.countries, visit);
    updateCitiesStatsForVisit(stats.cities, visit);
    updateCitiesForMapForVisit(stats.citiesForMap, visit);
    updateVisitedUrlsForVisit(stats.visitedUrls, visit);

    return stats;
  },
  { os: {}, browsers: {}, referrers: {}, countries: {}, cities: {}, citiesForMap: {}, visitedUrls: {} },
);

export const normalizeVisits = map((visit: Visit): NormalizedVisit => {
  const { userAgent, date, referer, visitLocation, potentialBot = false } = visit;
  const common = {
    date,
    potentialBot,
    ...parseUserAgent(userAgent),
    referer: extractDomain(referer),
    country: visitLocation?.countryName || 'Unknown', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    city: visitLocation?.cityName || 'Unknown', // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    latitude: visitLocation?.latitude,
    longitude: visitLocation?.longitude,
  };

  if (!isOrphanVisit(visit)) {
    return common;
  }

  return { ...common, type: visit.type, visitedUrl: visit.visitedUrl };
});

export interface VisitsParser {
  processStatsFromVisits: (normalizedVisits: NormalizedVisit[]) => VisitsStats;
  normalizeVisits: (visits: Visit[]) => NormalizedVisit[];
}
