import { useState } from 'react';

const DEFAULT_TIMEOUT_DELAY = 2000;

export const useStateFlagTimeout = (setTimeout) => (initialValue = true, delay = DEFAULT_TIMEOUT_DELAY) => {
  const [ flag, setFlag ] = useState(initialValue);
  const callback = () => {
    setFlag(!initialValue);
    setTimeout(() => setFlag(initialValue), delay);
  };

  return [ flag, callback ];
};

// Return [ flag, toggle, enable, disable ]
export const useToggle = (initialValue = false) => {
  const [ flag, setFlag ] = useState(initialValue);

  return [ flag, () => setFlag(!flag), () => setFlag(true), () => setFlag(false) ];
};
