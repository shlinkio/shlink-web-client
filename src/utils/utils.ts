import type { SyntheticEvent } from 'react';
import { v4 } from 'uuid';

export const handleEventPreventingDefault = <T>(handler: () => T) => (e: SyntheticEvent) => {
  e.preventDefault();
  handler();
};

export const randomUUID = () => v4();
