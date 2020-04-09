import { isEmpty, isNil, memoizeWith, prop } from 'ramda';
import { browserFromUserAgent, extractDomain, osFromUserAgent } from '../../utils/helpers/visits';

const visitLocationHasProperty = (visitLocation, propertyName) =>
  !isNil(visitLocation)
  && !isNil(visitLocation[propertyName])
  && !isEmpty(visitLocation[propertyName]);

const updateOsStatsForVisit = (osStats, { userAgent }) => {
  const os = osFromUserAgent(userAgent);

  osStats[os] = (osStats[os] || 0) + 1;
};

const updateBrowsersStatsForVisit = (browsersStats, { userAgent }) => {
  const browser = browserFromUserAgent(userAgent);

  browsersStats[browser] = (browsersStats[browser] || 0) + 1;
};

const updateReferrersStatsForVisit = (referrersStats, { referer }) => {
  const domain = extractDomain(referer);

  referrersStats[domain] = (referrersStats[domain] || 0) + 1;
};

const updateLocationsStatsForVisit = (propertyName) => (stats, { visitLocation }) => {
  const hasLocationProperty = visitLocationHasProperty(visitLocation, propertyName);
  const value = hasLocationProperty ? visitLocation[propertyName] : 'Unknown';

  stats[value] = (stats[value] || 0) + 1;
};

const updateCountriesStatsForVisit = updateLocationsStatsForVisit('countryName');
const updateCitiesStatsForVisit = updateLocationsStatsForVisit('cityName');

const updateCitiesForMapForVisit = (citiesForMapStats, { visitLocation }) => {
  if (!visitLocationHasProperty(visitLocation, 'cityName')) {
    return;
  }

  const { cityName, latitude, longitude } = visitLocation;
  const currentCity = citiesForMapStats[cityName] || {
    cityName,
    count: 0,
    latLong: [ parseFloat(latitude), parseFloat(longitude) ],
  };

  currentCity.count++;

  citiesForMapStats[cityName] = currentCity;
};

export const processStatsFromVisits = memoizeWith(prop('id'), ({ visits }) =>
  visits.reduce(
    (stats, visit) => {
      // We mutate the original object because it has a big side effect when large data sets are processed
      updateOsStatsForVisit(stats.os, visit);
      updateBrowsersStatsForVisit(stats.browsers, visit);
      updateReferrersStatsForVisit(stats.referrers, visit);
      updateCountriesStatsForVisit(stats.countries, visit);
      updateCitiesStatsForVisit(stats.cities, visit);
      updateCitiesForMapForVisit(stats.citiesForMap, visit);

      return stats;
    },
    { os: {}, browsers: {}, referrers: {}, countries: {}, cities: {}, citiesForMap: {} }
  ));
