import { render, screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { MemoryRouter } from 'react-router-dom';
import asideMenuCreator from '../../src/common/AsideMenu';
import { ReachableServer } from '../../src/servers/data';
import { SemVer } from '../../src/utils/helpers/version';

describe('<AsideMenu />', () => {
  const AsideMenu = asideMenuCreator(() => <>DeleteServerButton</>);
  const setUp = (version: SemVer, id: string | false = 'abc123') => render(
    <MemoryRouter>
      <AsideMenu selectedServer={Mock.of<ReachableServer>({ id: id || undefined, version })} />
    </MemoryRouter>,
  );

  it.each([
    ['2.7.0' as SemVer, 5],
    ['2.8.0' as SemVer, 6],
  ])('contains links to different sections', (version, expectedAmountOfLinks) => {
    setUp(version);

    const links = screen.getAllByRole('link');

    expect.assertions(links.length + 1);
    expect(links).toHaveLength(expectedAmountOfLinks);
    links.forEach((link) => expect(link.getAttribute('href')).toContain('abc123'));
  });

  it.each([
    ['abc', true],
    [false, false],
  ])('contains a button to delete server if appropriate', (id, shouldHaveBtn) => {
    setUp('2.8.0', id as string | false);

    if (shouldHaveBtn) {
      expect(screen.getByText('DeleteServerButton')).toBeInTheDocument();
    } else {
      expect(screen.queryByText('DeleteServerButton')).not.toBeInTheDocument();
    }
  });
});
