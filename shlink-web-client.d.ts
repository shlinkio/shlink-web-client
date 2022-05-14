declare module 'event-source-polyfill' {
  declare class EventSourcePolyfill {
    public onmessage?: ({ data }: { data: string }) => void;
    public onerror?: ({ status }: { status: number }) => void;
    public close: () => void;
    public constructor(hubUrl: URL, options?: any);
  }
}

declare module '*.png'
