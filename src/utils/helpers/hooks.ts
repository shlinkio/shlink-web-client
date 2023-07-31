import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQuery } from '../../../shlink-web-component/utils/helpers/query';

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

export const useGoBack = () => {
  const navigate = useNavigate();
  return () => navigate(-1);
};

export const useParsedQuery = <T>(): T => {
  const { search } = useLocation();
  return parseQuery<T>(search);
};
