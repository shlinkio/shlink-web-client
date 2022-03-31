import { NormalizedVisit } from '../../visits/types';
import { ExportableShortUrl } from '../../short-urls/data';
import { saveCsv } from '../../utils/helpers/files';
import { JsonToCsv } from '../../utils/helpers/csvjson';

export class ReportExporter {
  public constructor(private readonly window: Window, private readonly jsonToCsv: JsonToCsv) {}

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
    const csv = this.jsonToCsv(rows);

    saveCsv(this.window, csv, filename);
  };
}
