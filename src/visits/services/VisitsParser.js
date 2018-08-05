import { forEach, isNil, isEmpty } from 'ramda';

const osFromUserAgent = userAgent => {
  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case (lowerUserAgent.indexOf('linux') >= 0):
      return 'Linux';
    case (lowerUserAgent.indexOf('windows') >= 0):
      return 'Windows';
    case (lowerUserAgent.indexOf('mac') >= 0):
      return 'MacOS';
    case (lowerUserAgent.indexOf('mobi') >= 0):
      return 'Mobile';
    default:
      return 'Others';
  }
};

const browserFromUserAgent = userAgent => {
  const lowerUserAgent = userAgent.toLowerCase();

  switch (true) {
    case (lowerUserAgent.indexOf('firefox') >= 0):
      return 'Firefox';
    case (lowerUserAgent.indexOf('chrome') >= 0):
      return 'Chrome';
    case (lowerUserAgent.indexOf('safari') >= 0):
      return 'Safari';
    case (lowerUserAgent.indexOf('opera') >= 0):
      return 'Opera';
    case (lowerUserAgent.indexOf('msie') >= 0):
      return 'Internet Explorer';
    default:
      return 'Others';
  }
};

const extractDomain = url => {
  const domain = url.indexOf('://') > -1 ? url.split('/')[2] : url.split('/')[0];
  return domain.split(':')[0];
};

// FIXME Refactor these foreach statements which mutate a stats object
export class VisitsParser {
  processOsStats = visits => {
    const stats = {};

    forEach(visit => {
      const userAgent = visit.userAgent;
      const os = isNil(userAgent) ? 'Others' : osFromUserAgent(userAgent);

      stats[os] = typeof stats[os] === 'undefined' ? 1 : stats[os] + 1;
    }, visits);

    return stats;
  };

  processBrowserStats = visits => {
    const stats = {};

    forEach(visit => {
      const userAgent = visit.userAgent;
      const browser = isNil(userAgent) ? 'Others' : browserFromUserAgent(userAgent);

      stats[browser] = typeof stats[browser] === 'undefined' ? 1 : stats[browser] + 1;
    }, visits);

    return stats;
  };

  processReferrersStats = visits => {
    const stats = {};

    forEach(visit => {
      const notHasDomain = isNil(visit.referer) || isEmpty(visit.referer);
      const domain = notHasDomain ? 'Unknown' : extractDomain(visit.referer);

      stats[domain] = typeof stats[domain] === 'undefined' ? 1 : stats[domain] + 1;
    }, visits);

    return stats;
  };

  processCountriesStats = visits => {
    const stats = {};

    forEach(({ visitLocation }) => {
      const notHasCountry = isNil(visitLocation)
        || isNil(visitLocation.countryName)
        || isEmpty(visitLocation.countryName);
      const country = notHasCountry ? 'Unknown' : visitLocation.countryName;

      stats[country] = typeof stats[country] === 'undefined' ? 1 : stats[country] + 1;
    }, visits);

    return stats;
  };
}

export default new VisitsParser();
