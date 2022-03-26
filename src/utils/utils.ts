import { isEmpty, isNil, pipe, range } from 'ramda';
import { SyntheticEvent } from 'react';

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

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const nonEmptyValueOrNull = <T>(value: T): T | null => (isEmpty(value) ? null : value);

export const capitalize = <T extends string>(value: T): string => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
