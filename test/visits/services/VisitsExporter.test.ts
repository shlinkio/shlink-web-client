import { Mock } from 'ts-mockery';
import { CsvJson } from 'csvjson';
import { VisitsExporter } from '../../../src/visits/services/VisitsExporter';
import { NormalizedVisit } from '../../../src/visits/types';

describe('VisitsExporter', () => {
  const createLinkMock = () => ({
    setAttribute: jest.fn(),
    click: jest.fn(),
    style: {},
  });
  const windowMock = Mock.of<Window>({
    document: {
      createElement: jest.fn(createLinkMock),
      body: { appendChild: jest.fn(), removeChild: jest.fn() },
    },
  });
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
        },
      ];

      exporter.exportVisits('my_visits.csv', visits);

      expect(toCSV).toHaveBeenCalledWith(visits, {
        headers: 'browser,city,country,date,latitude,longitude,os,referer',
      });
    });

    it('skips execution when list of visits is empty', () => {
      exporter.exportVisits('my_visits.csv', []);

      expect(toCSV).not.toHaveBeenCalled();
    });
  });
});
