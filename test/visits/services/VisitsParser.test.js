import { processStatsFromVisits, normalizeVisits } from '../../../src/visits/services/VisitsParser';

describe('VisitsParser', () => {
  const visits = [
    {
      userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
      referer: 'https://google.com',
      visitLocation: {
        countryName: 'Spain',
        cityName: 'Zaragoza',
        latitude: '123.45',
        longitude: '-543.21',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
      referer: 'https://google.com',
      visitLocation: {
        countryName: 'United States',
        cityName: 'New York',
        latitude: '1029',
        longitude: '6758',
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
        cityName: 'Zaragoza',
        latitude: '123.45',
        longitude: '-543.21',
      },
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41',
    },
  ];

  describe('processStatsFromVisits', () => {
    let stats;

    beforeAll(() => {
      stats = processStatsFromVisits(visits);
    });

    it('properly parses OS stats', () => {
      const { os } = stats;

      expect(os).toEqual({
        Linux: 3,
        Windows: 1,
        MacOS: 1,
      });
    });

    it('properly parses browser stats', () => {
      const { browsers } = stats;

      expect(browsers).toEqual({
        Firefox: 2,
        Chrome: 2,
        Opera: 1,
      });
    });

    it('properly parses referrer stats', () => {
      const { referrers } = stats;

      expect(referrers).toEqual({
        'Direct': 2,
        'google.com': 2,
        'm.facebook.com': 1,
      });
    });

    it('properly parses countries stats', () => {
      const { countries } = stats;

      expect(countries).toEqual({
        'Spain': 3,
        'United States': 1,
        'Unknown': 1,
      });
    });

    it('properly parses cities stats', () => {
      const { cities } = stats;

      expect(cities).toEqual({
        'Zaragoza': 2,
        'New York': 1,
        'Unknown': 2,
      });
    });

    it('properly parses cities stats with lat and long', () => {
      const { citiesForMap } = stats;
      const zaragozaLat = 123.45;
      const zaragozaLong = -543.21;
      const newYorkLat = 1029;
      const newYorkLong = 6758;

      expect(citiesForMap).toEqual({
        'Zaragoza': {
          cityName: 'Zaragoza',
          count: 2,
          latLong: [ zaragozaLat, zaragozaLong ],
        },
        'New York': {
          cityName: 'New York',
          count: 1,
          latLong: [ newYorkLat, newYorkLong ],
        },
      });
    });
  });

  describe('normalizeVisits', () => {
    it('properly parses the list of visits', () => {
      expect(normalizeVisits(visits)).toEqual([
        {
          browser: 'Firefox',
          os: 'Windows',
          referer: 'google.com',
          country: 'Spain',
          city: 'Zaragoza',
          date: undefined,
        },
        {
          browser: 'Firefox',
          os: 'MacOS',
          referer: 'google.com',
          country: 'United States',
          city: 'New York',
          date: undefined,
        },
        {
          browser: 'Chrome',
          os: 'Linux',
          referer: 'Direct',
          country: 'Spain',
          city: 'Unknown',
          date: undefined,
        },
        {
          browser: 'Chrome',
          os: 'Linux',
          referer: 'm.facebook.com',
          country: 'Spain',
          city: 'Zaragoza',
          date: undefined,
        },
        {
          browser: 'Opera',
          os: 'Linux',
          referer: 'Direct',
          country: 'Unknown',
          city: 'Unknown',
          date: undefined,
        },
      ]);
    });
  });
});
