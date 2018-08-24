import visitsParser from '../../../src/visits/services/VisitsParser';

describe('VisitsParser', () => {
  const visits = [
    {
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
      referer: 'https://google.com',
      visitLocation: {
        countryName: 'Spain',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
      referer: 'https://google.com',
      visitLocation: {
        countryName: 'United States',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      visitLocation: {
        countryName: 'Spain',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
      referer: 'https://m.facebook.com',
      visitLocation: {
        countryName: 'Spain',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41',
    },
  ];

  describe('processOsStats', () => {
    it('properly parses OS stats', () => {
      expect(visitsParser.processOsStats(visits)).toEqual({
        'Linux': 3,
        'Windows': 1,
        'MacOS': 1,
      });
    });
  });

  describe('processBrowserStats', () => {
    it('properly parses browser stats', () => {
      expect(visitsParser.processBrowserStats(visits)).toEqual({
        'Firefox': 2,
        'Chrome': 2,
        'Opera': 1,
      });
    });
  });

  describe('processReferrersStats', () => {
    it('properly parses referrer stats', () => {
      expect(visitsParser.processReferrersStats(visits)).toEqual({
        'Unknown': 2,
        'google.com': 2,
        'm.facebook.com': 1,
      });
    });
  });

  describe('processCountriesStats', () => {
    it('properly parses countries stats', () => {
      expect(visitsParser.processCountriesStats(visits)).toEqual({
        'Spain': 3,
        'United States': 1,
        'Unknown': 1,
      });
    });
  });
});
