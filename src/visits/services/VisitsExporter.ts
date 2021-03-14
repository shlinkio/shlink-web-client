import { CsvJson } from 'csvjson';
import { head, keys } from 'ramda';
import { NormalizedVisit } from '../types';
import { saveCsv } from '../../utils/helpers/csv';

export class VisitsExporter {
  public constructor(
    private readonly window: Window,
    private readonly csvjson: CsvJson,
  ) {}

  public readonly exportVisits = (filename: string, visits: NormalizedVisit[]) => {
    try {
      const csv = this.csvjson.toCSV(visits, {
        headers: keys(head(visits)).join(','),
      });

      saveCsv(this.window, csv, filename);
    } catch (e) {
      // FIXME Handle error
      console.error(e);
    }
  };
}
