import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { NonReachableServer, NotFoundServer } from '../../../src/servers/data';
import { ServerErrorFactory } from '../../../src/servers/helpers/ServerError';

describe('<ServerError />', () => {
  const ServerError = ServerErrorFactory(fromPartial({ DeleteServerButton: () => null }));

  it.each([
    [
      fromPartial<NotFoundServer>({}),
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
      fromPartial<NonReachableServer>({ id: 'abc123' }),
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
