import qs from 'qs';

// FIXME Use URLSearchParams instead of qs package

export const parseQuery = <T>(search: string) => qs.parse(search, { ignoreQueryPrefix: true }) as unknown as T;

export const stringifyQuery = (query: any): string => qs.stringify(query, { arrayFormat: 'brackets' });
