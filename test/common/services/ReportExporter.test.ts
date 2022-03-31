import { ReportExporter } from '../../../src/common/services/ReportExporter';
import { NormalizedVisit } from '../../../src/visits/types';
import { windowMock } from '../../mocks/WindowMock';
import { ExportableShortUrl } from '../../../src/short-urls/data';

describe('ReportExporter', () => {
  const jsonToCsv = jest.fn();
  let exporter: ReportExporter;

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    (global as any).Blob = class Blob {};
    (global as any).URL = { createObjectURL: () => '' };

    exporter = new ReportExporter(windowMock, jsonToCsv);
  });

  describe('exportVisits', () => {
    it('parses provided visits to CSV', () => {
      const visits: NormalizedVisit[] = [
        {
          browser: 'browser',
          city: 'city',
          country: 'country',
          date: 'date',
          latitude: 0,
          longitude: 0,
          os: 'os',
          referer: 'referer',
          potentialBot: false,
        },
      ];

      exporter.exportVisits('my_visits.csv', visits);

      expect(jsonToCsv).toHaveBeenCalledWith(visits);
    });

    it('skips execution when list of visits is empty', () => {
      exporter.exportVisits('my_visits.csv', []);

      expect(jsonToCsv).not.toHaveBeenCalled();
    });
  });

  describe('exportShortUrls', () => {
    it('parses provided short URLs to CSV', () => {
      const shortUrls: ExportableShortUrl[] = [
        {
          shortUrl: 'shortUrl',
          visits: 10,
          title: '',
          createdAt: '',
          longUrl: '',
          tags: '',
        },
      ];

      exporter.exportShortUrls(shortUrls);

      expect(jsonToCsv).toHaveBeenCalledWith(shortUrls);
    });

    it('skips execution when list of visits is empty', () => {
      exporter.exportShortUrls([]);

      expect(jsonToCsv).not.toHaveBeenCalled();
    });
  });
});
