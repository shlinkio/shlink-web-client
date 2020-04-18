import { useState, useRef } from 'react';

const DEFAULT_DELAY = 2000;

export const useStateFlagTimeout = (setTimeout, clearTimeout) => (initialValue = false, delay = DEFAULT_DELAY) => {
  const [ flag, setFlag ] = useState(initialValue);
  const timeout = useRef(undefined);
  const callback = () => {
    setFlag(!initialValue);

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => setFlag(initialValue), delay);
  };

  return [ flag, callback ];
};

// Return [ flag, toggle, enable, disable ]
export const useToggle = (initialValue = false) => {
  const [ flag, setFlag ] = useState(initialValue);

  return [ flag, () => setFlag(!flag), () => setFlag(true), () => setFlag(false) ];
};
