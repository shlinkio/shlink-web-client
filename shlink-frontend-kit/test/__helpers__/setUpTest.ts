import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export const renderWithEvents = (element: ReactElement) => ({
  user: userEvent.setup(),
  ...render(element),
});
