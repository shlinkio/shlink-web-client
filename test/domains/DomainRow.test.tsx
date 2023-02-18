import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import type { ShlinkDomainRedirects } from '../../src/api/types';
import type { Domain } from '../../src/domains/data';
import { DomainRow } from '../../src/domains/DomainRow';
import type { SelectedServer } from '../../src/servers/data';

describe('<DomainRow />', () => {
  const redirectsCombinations = [
    [Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'foo' })],
    [Mock.of<ShlinkDomainRedirects>({ invalidShortUrlRedirect: 'bar' })],
    [Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'baz', regular404Redirect: 'foo' })],
    [
      Mock.of<ShlinkDomainRedirects>(
        { baseUrlRedirect: 'baz', regular404Redirect: 'bar', invalidShortUrlRedirect: 'foo' },
      ),
    ],
  ];
  const setUp = (domain: Domain, defaultRedirects?: ShlinkDomainRedirects) => render(
    <table>
      <tbody>
        <DomainRow
          domain={domain}
          defaultRedirects={defaultRedirects}
          selectedServer={Mock.all<SelectedServer>()}
          editDomainRedirects={jest.fn()}
          checkDomainHealth={jest.fn()}
        />
      </tbody>
    </table>,
  );

  it.each(redirectsCombinations)('shows expected redirects', (redirects) => {
    setUp(Mock.of<Domain>({ domain: '', isDefault: true, redirects }));
    const cells = screen.getAllByRole('cell');

    redirects?.baseUrlRedirect && expect(cells[1]).toHaveTextContent(redirects.baseUrlRedirect);
    redirects?.regular404Redirect && expect(cells[2]).toHaveTextContent(redirects.regular404Redirect);
    redirects?.invalidShortUrlRedirect && expect(cells[3]).toHaveTextContent(redirects.invalidShortUrlRedirect);
    expect(screen.queryByText('(as fallback)')).not.toBeInTheDocument();
  });

  it.each([
    [undefined],
    [Mock.of<ShlinkDomainRedirects>()],
  ])('shows expected "no redirects"', (redirects) => {
    setUp(Mock.of<Domain>({ domain: '', isDefault: true, redirects }));
    const cells = screen.getAllByRole('cell');

    expect(cells[1]).toHaveTextContent('No redirect');
    expect(cells[2]).toHaveTextContent('No redirect');
    expect(cells[3]).toHaveTextContent('No redirect');
    expect(screen.queryByText('(as fallback)')).not.toBeInTheDocument();
  });

  it.each(redirectsCombinations)('shows expected fallback redirects', (fallbackRedirects) => {
    setUp(Mock.of<Domain>({ domain: '', isDefault: true }), fallbackRedirects);
    const cells = screen.getAllByRole('cell');

    fallbackRedirects?.baseUrlRedirect && expect(cells[1]).toHaveTextContent(
      `${fallbackRedirects.baseUrlRedirect} (as fallback)`,
    );
    fallbackRedirects?.regular404Redirect && expect(cells[2]).toHaveTextContent(
      `${fallbackRedirects.regular404Redirect} (as fallback)`,
    );
    fallbackRedirects?.invalidShortUrlRedirect && expect(cells[3]).toHaveTextContent(
      `${fallbackRedirects.invalidShortUrlRedirect} (as fallback)`,
    );
  });

  it.each([[true], [false]])('shows icon on default domain only', (isDefault) => {
    const { container } = setUp(Mock.of<Domain>({ domain: '', isDefault }));

    if (isDefault) {
      expect(container.querySelector('#defaultDomainIcon')).toBeInTheDocument();
    } else {
      expect(container.querySelector('#defaultDomainIcon')).not.toBeInTheDocument();
    }
  });
});
