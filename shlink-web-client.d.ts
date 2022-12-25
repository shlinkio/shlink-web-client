// eslint-disable-next-line max-classes-per-file
declare module 'event-source-polyfill' {
  declare class EventSourcePolyfill {
    public onmessage?: ({ data }: { data: string }) => void;
    public onerror?: ({ status }: { status: number }) => void;
    public close: () => void;
    public constructor(hubUrl: URL, options?: any);
  }
}

declare module '@json2csv/plainjs' {
  export class Parser {
    parse: <T>(data: T[]) => string;
  }
}

declare module '*.png'
