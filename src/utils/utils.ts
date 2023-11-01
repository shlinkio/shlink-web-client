import type { SyntheticEvent } from 'react';

export const handleEventPreventingDefault = <T>(handler: () => T) => (e: SyntheticEvent) => {
  e.preventDefault();
  handler();
};
