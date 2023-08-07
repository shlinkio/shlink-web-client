import { pipe, range } from 'ramda';
import type { SyntheticEvent } from 'react';

type Optional<T> = T | null | undefined;

export type OptionalString = Optional<string>;

export const handleEventPreventingDefault = <T>(handler: () => T) => pipe(
  (e: SyntheticEvent) => e.preventDefault(),
  handler,
);

export const rangeOf = <T>(size: number, mappingFn: (value: number) => T, startAt = 1): T[] =>
  range(startAt, size + 1).map(mappingFn);
