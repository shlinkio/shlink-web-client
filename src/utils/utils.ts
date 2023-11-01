import { range } from 'ramda';
import type { SyntheticEvent } from 'react';

export const handleEventPreventingDefault = <T>(handler: () => T) => (e: SyntheticEvent) => {
  e.preventDefault();
  handler();
};

export const rangeOf = <T>(size: number, mappingFn: (value: number) => T, startAt = 1): T[] =>
  range(startAt, size + 1).map(mappingFn);
