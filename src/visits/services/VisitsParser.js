import { isNil, isEmpty, memoizeWith, prop } from 'ramda';

const osFromUserAgent = (userAgent) => {
  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case lowerUserAgent.indexOf('linux') >= 0:
      return 'Linux';
    case lowerUserAgent.indexOf('windows') >= 0:
      return 'Windows';
    case lowerUserAgent.indexOf('mac') >= 0:
      return 'MacOS';
    case lowerUserAgent.indexOf('mobi') >= 0:
      return 'Mobile';
    default:
      return 'Others';
  }
};

const browserFromUserAgent = (userAgent) => {
  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case lowerUserAgent.indexOf('opera') >= 0 || lowerUserAgent.indexOf('opr') >= 0:
      return 'Opera';
    case lowerUserAgent.indexOf('firefox') >= 0:
      return 'Firefox';
    case lowerUserAgent.indexOf('chrome') >= 0:
      return 'Chrome';
    case lowerUserAgent.indexOf('safari') >= 0:
      return 'Safari';
    case lowerUserAgent.indexOf('msie') >= 0:
      return 'Internet Explorer';
    default:
      return 'Others';
  }
};

const extractDomain = (url) => {
  const domain = url.indexOf('://') > -1 ? url.split('/')[2] : url.split('/')[0];

  return domain.split(':')[0];
};

const visitLocationHasProperty = (visitLocation, propertyName) =>
  !isNil(visitLocation)
  && !isNil(visitLocation[propertyName])
  && !isEmpty(visitLocation[propertyName]);

const updateOsStatsForVisit = (osStats, { userAgent }) => {
  const os = isNil(userAgent) ? 'Others' : osFromUserAgent(userAgent);

  osStats[os] = (osStats[os] || 0) + 1;
};

const updateBrowsersStatsForVisit = (browsersStats, { userAgent }) => {
  const browser = isNil(userAgent) ? 'Others' : browserFromUserAgent(userAgent);

  browsersStats[browser] = (browsersStats[browser] || 0) + 1;
};

const updateReferrersStatsForVisit = (referrersStats, { referer }) => {
  const notHasDomain = isNil(referer) || isEmpty(referer);
  const domain = notHasDomain ? 'Direct' : extractDomain(referer);

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
