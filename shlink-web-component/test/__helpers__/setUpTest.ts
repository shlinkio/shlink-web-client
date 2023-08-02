import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export const setUpCanvas = (element: ReactElement) => {
  const result = render(element);
  const { container } = result;
  const getEvents = () => {
    const context = container.querySelector('canvas')?.getContext('2d');
    // @ts-expect-error __getEvents is set by vitest-canvas-mock
    return context?.__getEvents(); // eslint-disable-line no-underscore-dangle
  };

  return { ...result, events: getEvents(), getEvents };
};

export const renderWithEvents = (element: ReactElement) => ({
  user: userEvent.setup(),
  ...render(element),
});
