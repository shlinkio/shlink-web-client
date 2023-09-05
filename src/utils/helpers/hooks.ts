import { parseQuery } from '@shlinkio/shlink-frontend-kit';
import { useCallback, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_DELAY = 2000;

export type TimeoutToggle = typeof useTimeoutToggle;

export const useTimeoutToggle = (
  initialValue = false,
  delay = DEFAULT_DELAY,

  // Test seams
  setTimeout = window.setTimeout,
  clearTimeout = window.clearTimeout,
): [boolean, () => void] => {
  const [flag, setFlag] = useState<boolean>(initialValue);
  const initialValueRef = useRef(initialValue);
  const timeout = useRef<number | undefined>(undefined);
  const callback = useCallback(() => {
    setFlag(!initialValueRef.current);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => setFlag(initialValueRef.current), delay);
  }, [clearTimeout, delay, setTimeout]);

  return [flag, callback];
};

export const useGoBack = () => {
  const navigate = useNavigate();
  return () => navigate(-1);
};

export const useParsedQuery = <T>(): T => {
  const { search } = useLocation();
  return parseQuery<T>(search);
};
