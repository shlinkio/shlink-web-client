declare module '@json2csv/plainjs' {
  export class Parser {
    parse: <T>(data: T[]) => string;
  }
}

declare module '*.png';
