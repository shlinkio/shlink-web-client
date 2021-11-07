import qs from 'qs';

export const parseQuery = <T>(search: string) => qs.parse(search, { ignoreQueryPrefix: true }) as unknown as T;

export const stringifyQuery = (query: any): string => qs.stringify(query, { arrayFormat: 'brackets' });

export const evolveStringifiedQuery = (currentQuery: string, extra: any): string =>
  stringifyQuery({ ...parseQuery(currentQuery), ...extra });
