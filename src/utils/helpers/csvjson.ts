import { Parser } from '@json2csv/plainjs';
import csv from 'csvtojson';

export const csvToJson = <T>(csvContent: string) =>
  new Promise<T[]>((resolve) => {
    csv().fromString(csvContent).then(resolve);
  });

export type CsvToJson = typeof csvToJson;

const jsonParser = new Parser(); // This accepts options if needed

export const jsonToCsv = <T>(data: T[]): string => jsonParser.parse(data);

export type JsonToCsv = typeof jsonToCsv;
