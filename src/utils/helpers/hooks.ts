import { useState, useRef } from 'react';
import { useSwipeable as useReactSwipeable } from 'react-swipeable';

const DEFAULT_DELAY = 2000;

export type StateFlagTimeout = (initialValue?: boolean, delay?: number) => [ boolean, () => void ];

export const useStateFlagTimeout = (
  setTimeout: (callback: Function, timeout: number) => number,
  clearTimeout: (timer: number) => void,
): StateFlagTimeout => (initialValue = false, delay = DEFAULT_DELAY) => {
  const [ flag, setFlag ] = useState<boolean>(initialValue);
  const timeout = useRef<number | undefined>(undefined);
  const callback = () => {
    setFlag(!initialValue);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => setFlag(initialValue), delay);
  };

  return [ flag, callback ];
};

type ToggleResult = [ boolean, () => void, () => void, () => void ];

export const useToggle = (initialValue = false): ToggleResult => {
  const [ flag, setFlag ] = useState<boolean>(initialValue);

  return [ flag, () => setFlag(!flag), () => setFlag(true), () => setFlag(false) ];
};

export const useSwipeable = (showSidebar: () => void, hideSidebar: () => void) => {
  const swipeMenuIfNoModalExists = (callback: () => void) => (e: any) => {
    const swippedOnVisitsTable = (e.event.composedPath() as HTMLElement[]).some( // eslint-disable-line @typescript-eslint/no-unsafe-call
      ({ classList }) => classList?.contains('visits-table'),
    );

    if (swippedOnVisitsTable || document.querySelector('.modal')) {
      return;
    }

    callback();
  };

  return useReactSwipeable({
    delta: 40,
    onSwipedLeft: swipeMenuIfNoModalExists(hideSidebar),
    onSwipedRight: swipeMenuIfNoModalExists(showSidebar),
  });
};
