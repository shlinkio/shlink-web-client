import { ReactElement } from 'react';
import { render } from '@testing-library/react';

export const setUpCanvas = (element: ReactElement) => {
  const result = render(element);
  const { container } = result;
  const events = container.querySelector('canvas')?.getContext('2d')?.__getEvents(); // eslint-disable-line no-underscore-dangle

  return { ...result, events };
};
