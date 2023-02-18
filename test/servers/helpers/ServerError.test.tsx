import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import type { NonReachableServer, NotFoundServer } from '../../../src/servers/data';
import { ServerError as createServerError } from '../../../src/servers/helpers/ServerError';

describe('<ServerError />', () => {
  const ServerError = createServerError(() => null);

  it.each([
    [
      Mock.all<NotFoundServer>(),
      {
        found: ['Could not find this Shlink server.'],
        notFound: [
          'Oops! Could not connect to this Shlink server.',
          'Make sure you have internet connection, and the server is properly configured and on-line.',
          /^Alternatively, if you think you may have miss-configured this server/,
        ],
      },
    ],
    [
      Mock.of<NonReachableServer>({ id: 'abc123' }),
      {
        found: [
          'Oops! Could not connect to this Shlink server.',
          'Make sure you have internet connection, and the server is properly configured and on-line.',
          /^Alternatively, if you think you may have miss-configured this server/,
        ],
        notFound: ['Could not find this Shlink server.'],
      },
    ],
  ])('renders expected information based on provided server type', (selectedServer, { found, notFound }) => {
    render(
      <MemoryRouter>
        <ServerError servers={{}} selectedServer={selectedServer} />
      </MemoryRouter>,
    );

    found.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
    notFound.forEach((text) => expect(screen.queryByText(text)).not.toBeInTheDocument());
  });
});
