import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const setUpCanvas = (element: ReactElement) => {
  const result = render(element);
  const { container } = result;
  const getEvents = () => container.querySelector('canvas')?.getContext('2d')?.__getEvents(); // eslint-disable-line no-underscore-dangle

  return { ...result, events: getEvents(), getEvents };
};

export const renderWithEvents = (element: ReactElement) => ({
  user: userEvent.setup(),
  ...render(element),
});
