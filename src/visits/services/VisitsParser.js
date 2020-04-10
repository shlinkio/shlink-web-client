import { isNil, map } from 'ramda';
import { browserFromUserAgent, extractDomain, osFromUserAgent } from '../../utils/helpers/visits';
import { hasValue } from '../../utils/utils';

const visitHasProperty = (visit, propertyName) => !isNil(visit) && hasValue(visit[propertyName]);

const updateOsStatsForVisit = (osStats, { os }) => {
  osStats[os] = (osStats[os] || 0) + 1;
};

const updateBrowsersStatsForVisit = (browsersStats, { browser }) => {
  browsersStats[browser] = (browsersStats[browser] || 0) + 1;
};

const updateReferrersStatsForVisit = (referrersStats, { referer: domain }) => {
  referrersStats[domain] = (referrersStats[domain] || 0) + 1;
};

const updateLocationsStatsForVisit = (propertyName) => (stats, visit) => {
  const hasLocationProperty = visitHasProperty(visit, propertyName);
  const value = hasLocationProperty ? visit[propertyName] : 'Unknown';

  stats[value] = (stats[value] || 0) + 1;
};

const updateCountriesStatsForVisit = updateLocationsStatsForVisit('country');
const updateCitiesStatsForVisit = updateLocationsStatsForVisit('city');

const updateCitiesForMapForVisit = (citiesForMapStats, visit) => {
  if (!visitHasProperty(visit, 'city') || visit.city === 'Unknown') {
    return;
  }

  const { city, latitude, longitude } = visit;
  const currentCity = citiesForMapStats[city] || {
    cityName: city,
    count: 0,
    latLong: [ parseFloat(latitude), parseFloat(longitude) ],
  };

  currentCity.count++;

  citiesForMapStats[city] = currentCity;
};

export const processStatsFromVisits = (normalizedVisits) =>
  normalizedVisits.reduce(
    (stats, visit) => {
      // We mutate the original object because it has a big performance impact when large data sets are processed
      updateOsStatsForVisit(stats.os, visit);
      updateBrowsersStatsForVisit(stats.browsers, visit);
      updateReferrersStatsForVisit(stats.referrers, visit);
      updateCountriesStatsForVisit(stats.countries, visit);
      updateCitiesStatsForVisit(stats.cities, visit);
      updateCitiesForMapForVisit(stats.citiesForMap, visit);

      return stats;
    },
    { os: {}, browsers: {}, referrers: {}, countries: {}, cities: {}, citiesForMap: {} }
  );

export const normalizeVisits = map(({ userAgent, date, referer, visitLocation }) => ({
  date,
  browser: browserFromUserAgent(userAgent),
  os: osFromUserAgent(userAgent),
  referer: extractDomain(referer),
  country: (visitLocation && visitLocation.countryName) || 'Unknown',
  city: (visitLocation && visitLocation.cityName) || 'Unknown',
  latitude: visitLocation && visitLocation.latitude,
  longitude: visitLocation && visitLocation.longitude,
}));
