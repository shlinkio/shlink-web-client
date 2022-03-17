import { CsvJson } from 'csvjson';
import { NormalizedVisit } from '../../visits/types';
import { ExportableShortUrl } from '../../short-urls/data';
import { saveCsv } from '../../utils/helpers/files';

export class ReportExporter {
  public constructor(
    private readonly window: Window,
    private readonly csvjson: CsvJson,
  ) {}

  public readonly exportVisits = (filename: string, visits: NormalizedVisit[]) => {
    if (!visits.length) {
      return;
    }

    this.exportCsv(filename, visits);
  };

  public readonly exportShortUrls = (shortUrls: ExportableShortUrl[]) => {
    if (!shortUrls.length) {
      return;
    }

    this.exportCsv('short_urls.csv', shortUrls);
  };

  private readonly exportCsv = (filename: string, rows: object[]) => {
    const csv = this.csvjson.toCSV(rows, { headers: 'key', wrap: true });

    saveCsv(this.window, csv, filename);
  };
}
