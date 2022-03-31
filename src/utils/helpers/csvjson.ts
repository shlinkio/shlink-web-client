import csv from 'csvtojson';
import { parse } from 'json2csv';

export const csvToJson = <T>(csvContent: string) => new Promise<T[]>((resolve) => {
  csv().fromString(csvContent).then(resolve);
});

export type CsvToJson = typeof csvToJson;

export const jsonToCsv = <T>(data: T[]): string => parse(data);

export type JsonToCsv = typeof jsonToCsv;
