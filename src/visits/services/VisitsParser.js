import { assoc, isNil, isEmpty, reduce } from 'ramda';

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

export const processOsStats = (visits) =>
  reduce(
    (stats, { userAgent }) => {
      const os = isNil(userAgent) ? 'Others' : osFromUserAgent(userAgent);

      return assoc(os, (stats[os] || 0) + 1, stats);
    },
    {},
    visits,
  );

export const processBrowserStats = (visits) =>
  reduce(
    (stats, { userAgent }) => {
      const browser = isNil(userAgent) ? 'Others' : browserFromUserAgent(userAgent);

      return assoc(browser, (stats[browser] || 0) + 1, stats);
    },
    {},
    visits,
  );

export const processReferrersStats = (visits) =>
  reduce(
    (stats, visit) => {
      const notHasDomain = isNil(visit.referer) || isEmpty(visit.referer);
      const domain = notHasDomain ? 'Unknown' : extractDomain(visit.referer);

      return assoc(domain, (stats[domain] || 0) + 1, stats);
    },
    {},
    visits,
  );

export const processCountriesStats = (visits) =>
  reduce(
    (stats, { visitLocation }) => {
      const notHasCountry = isNil(visitLocation)
        || isNil(visitLocation.countryName)
        || isEmpty(visitLocation.countryName);
      const country = notHasCountry ? 'Unknown' : visitLocation.countryName;

      return assoc(country, (stats[country] || 0) + 1, stats);
    },
    {},
    visits,
  );
