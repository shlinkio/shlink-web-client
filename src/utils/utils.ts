import type { SyntheticEvent } from 'react';
import { useCallback } from 'react';

/**
 * Wraps an event handler so that it calls e.preventDefault() before invoking the event handler
 */
export const usePreventDefault = <Event extends SyntheticEvent = SyntheticEvent>(handler: (e: Event) => void) =>
  useCallback((e: Event) => {
    e.preventDefault();
    handler(e);
  }, [handler]);
