import { useState, useRef, EffectCallback, DependencyList, useEffect } from 'react';
import { useSwipeable as useReactSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import { parseQuery, stringifyQuery } from './query';

const DEFAULT_DELAY = 2000;

export type StateFlagTimeout = (initialValue?: boolean, delay?: number) => [ boolean, () => void ];

export const useStateFlagTimeout = (
  setTimeout: (callback: Function, timeout: number) => number,
  clearTimeout: (timer: number) => void,
): StateFlagTimeout => (initialValue = false, delay = DEFAULT_DELAY) => {
  const [flag, setFlag] = useState<boolean>(initialValue);
  const timeout = useRef<number | undefined>(undefined);
  const callback = () => {
    setFlag(!initialValue);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => setFlag(initialValue), delay);
  };

  return [flag, callback];
};

type ToggleResult = [ boolean, () => void, () => void, () => void ];

export const useToggle = (initialValue = false): ToggleResult => {
  const [flag, setFlag] = useState<boolean>(initialValue);

  return [flag, () => setFlag(!flag), () => setFlag(true), () => setFlag(false)];
};

export const useSwipeable = (showSidebar: () => void, hideSidebar: () => void) => {
  const swipeMenuIfNoModalExists = (callback: () => void) => (e: any) => {
    const swippedOnVisitsTable = (e.event.composedPath() as HTMLElement[]).some(
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

export const useQueryState = <T>(paramName: string, initialState: T): [ T, (newValue: T) => void ] => {
  const [value, setValue] = useState(initialState);
  const setValueWithLocation = (valueToSet: T) => {
    const { location, history } = window;
    const query = parseQuery<any>(location.search);

    query[paramName] = valueToSet;
    history.pushState(null, '', `${location.pathname}?${stringifyQuery(query)}`);
    setValue(valueToSet);
  };

  return [value, setValueWithLocation];
};

export const useEffectExceptFirstTime = (callback: EffectCallback, deps: DependencyList): void => {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    !isFirstLoad.current && callback();
    isFirstLoad.current = false;
  }, deps);
};

export const useGoBack = () => {
  const navigate = useNavigate();

  return () => navigate(-1);
};
