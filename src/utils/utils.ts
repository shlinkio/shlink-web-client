import { pipe } from 'ramda';
import type { SyntheticEvent } from 'react';

type Optional<T> = T | null | undefined;

export type OptionalString = Optional<string>;

export const handleEventPreventingDefault = <T>(handler: () => T) => pipe(
  (e: SyntheticEvent) => e.preventDefault(),
  handler,
);
