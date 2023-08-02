import { Parser } from '@json2csv/plainjs';

const jsonParser = new Parser(); // This accepts options if needed

export const jsonToCsv = <T>(data: T[]): string => jsonParser.parse(data);

export type JsonToCsv = typeof jsonToCsv;
