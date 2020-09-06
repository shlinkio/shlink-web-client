declare module 'event-source-polyfill' {
  export const EventSourcePolyfill: any;
}

declare module 'csvjson' {
  export declare class CsvJson {
    public toObject<T>(content: string): T[];
    public toCSV<T>(data: T[], options: { headers: string }): string;
  }
}

declare module '*.png'
