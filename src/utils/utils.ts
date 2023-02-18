import { isEmpty, isNil, pipe, range } from 'ramda';
import type { SyntheticEvent } from 'react';

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

export const nonEmptyValueOrNull = <T>(value: T): T | null => (isEmpty(value) ? null : value);

export const capitalize = <T extends string>(value: T): string => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const equals = (value: any) => (otherValue: any) => value === otherValue;

export type BooleanString = 'true' | 'false';

export const parseBooleanToString = (value: boolean): BooleanString => (value ? 'true' : 'false');

export const parseOptionalBooleanToString = (value?: boolean): BooleanString | undefined => (
  value === undefined ? undefined : parseBooleanToString(value)
);
