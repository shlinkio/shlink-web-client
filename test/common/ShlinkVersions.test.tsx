import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import type { ShlinkVersionsProps } from '../../src/common/ShlinkVersions';
import { ShlinkVersions } from '../../src/common/ShlinkVersions';
import type { NonReachableServer, NotFoundServer, ReachableServer } from '../../src/servers/data';

describe('<ShlinkVersions />', () => {
  const setUp = (props: ShlinkVersionsProps) => render(<ShlinkVersions {...props} />);

  it.each([
    ['1.2.3', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'foo' }), 'v1.2.3', 'foo'],
    ['foo', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: '1.2.3' }), 'latest', '1.2.3'],
    ['latest', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'latest' }), 'latest', 'latest'],
    ['5.5.0', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: '0.2.8' }), 'v5.5.0', '0.2.8'],
    ['not-semver', Mock.of<ReachableServer>({ version: '1.0.0', printableVersion: 'some' }), 'latest', 'some'],
  ])(
    'displays expected versions when selected server is reachable',
    (clientVersion, selectedServer, expectedClientVersion, expectedServerVersion) => {
      setUp({ clientVersion, selectedServer });
      const [serverLink, clientLink] = screen.getAllByRole('link');

      expect(serverLink).toHaveAttribute(
        'href',
        `https://github.com/shlinkio/shlink/releases/${expectedServerVersion}`,
      );
      expect(serverLink).toHaveTextContent(expectedServerVersion);
      expect(clientLink).toHaveAttribute(
        'href',
        `https://github.com/shlinkio/shlink-web-client/releases/${expectedClientVersion}`,
      );
      expect(clientLink).toHaveTextContent(expectedClientVersion);
    },
  );

  it.each([
    ['1.2.3', null],
    ['1.2.3', Mock.of<NotFoundServer>({ serverNotFound: true })],
    ['1.2.3', Mock.of<NonReachableServer>({ serverNotReachable: true })],
  ])('displays only client version when selected server is not reachable', (clientVersion, selectedServer) => {
    setUp({ clientVersion, selectedServer });
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://github.com/shlinkio/shlink-web-client/releases/v1.2.3');
  });
});
