import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

type ToggleResult = [boolean, () => void, () => void, () => void];

export const useToggle = (initialValue = false): ToggleResult => {
  const [flag, setFlag] = useState<boolean>(initialValue);
  return [flag, () => setFlag(!flag), () => setFlag(true), () => setFlag(false)];
};

export const useDomId = (): string => {
  const { current: id } = useRef(`dom-${uuid()}`);
  return id;
};

export const useElementRef = <T>() => useRef<T | null>(null);
