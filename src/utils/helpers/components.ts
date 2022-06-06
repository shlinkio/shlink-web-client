import { MutableRefObject, Ref } from 'react';

export const mutableRefToElementRef = <T>(ref: MutableRefObject<T | undefined>): Ref<T> => (el) => {
  ref.current = el ?? undefined; // eslint-disable-line no-param-reassign
};
