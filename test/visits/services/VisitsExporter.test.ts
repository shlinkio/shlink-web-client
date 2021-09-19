import { Mock } from 'ts-mockery';
import { CsvJson } from 'csvjson';
import { VisitsExporter } from '../../../src/visits/services/VisitsExporter';
import { NormalizedVisit } from '../../../src/visits/types';
import { windowMock } from '../../mocks/WindowMock';

describe('VisitsExporter', () => {
  const toCSV = jest.fn();
  const csvToJsonMock = Mock.of<CsvJson>({ toCSV });
  let exporter: VisitsExporter;

  beforeEach(jest.clearAllMocks);
  beforeEach(() => {
    (global as any).Blob = class Blob {}; // eslint-disable-line @typescript-eslint/no-extraneous-class
    (global as any).URL = { createObjectURL: () => '' };

    exporter = new VisitsExporter(windowMock, csvToJsonMock);
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

      expect(toCSV).toHaveBeenCalledWith(visits, { headers: 'key' });
    });

    it('skips execution when list of visits is empty', () => {
      exporter.exportVisits('my_visits.csv', []);

      expect(toCSV).not.toHaveBeenCalled();
    });
  });
});
