import { DependencyList, EffectCallback, useEffect, useRef, useState } from 'react';
import { useSwipeable as useReactSwipeable } from 'react-swipeable';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { parseQuery, stringifyQuery } from './query';

const DEFAULT_DELAY = 2000;

export type TimeoutToggle = (initialValue?: boolean, delay?: number) => [boolean, () => void];

export const useTimeoutToggle = (
  setTimeout: (callback: Function, timeout: number) => number,
  clearTimeout: (timer: number) => void,
): TimeoutToggle => (initialValue = false, delay = DEFAULT_DELAY) => {
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

type ToggleResult = [boolean, () => void, () => void, () => void];

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

export const useParsedQuery = <T>(): T => {
  const { search } = useLocation();
  return parseQuery<T>(search);
};

export const useDomId = (): string => {
  const { current: id } = useRef(`dom-${uuid()}`);
  return id;
};

export const useElementRef = <T>() => useRef<T | null>(null);
