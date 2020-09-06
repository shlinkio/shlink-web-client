import { isEmpty, isNil, pipe, range } from 'ramda';
import { SyntheticEvent } from 'react';

export type OrderDir = 'ASC' | 'DESC' | undefined;

export const determineOrderDir = <T extends string = string>(
  currentField: T,
  newField?: T,
  currentOrderDir?: OrderDir,
): OrderDir => {
  if (currentField !== newField) {
    return 'ASC';
  }

  const newOrderMap: Record<'ASC' | 'DESC', OrderDir> = {
    ASC: 'DESC',
    DESC: undefined,
  };

  return currentOrderDir ? newOrderMap[currentOrderDir] : 'ASC';
};

export const rangeOf = <T>(size: number, mappingFn: (value: number) => T, startAt = 1): T[] =>
  range(startAt, size + 1).map(mappingFn);

export type Empty = null | undefined | '' | never[];

export const hasValue = <T>(value: T | Empty): value is T => !isNil(value) && !isEmpty(value);

export const handleEventPreventingDefault = <T>(handler: () => T) => pipe(
  (e: SyntheticEvent) => e.preventDefault(),
  handler,
);

export type Nullable<T> = {
  [P in keyof T]: T[P] | null
};

type Optional<T> = T | null | undefined;

export type OptionalString = Optional<string>;
