import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { AsideMenu as createAsideMenu } from '../../src/common/AsideMenu';

describe('<AsideMenu />', () => {
  const AsideMenu = createAsideMenu(() => <>DeleteServerButton</>);
  const setUp = (id: string | false = 'abc123') => render(
    <MemoryRouter>
      <AsideMenu selectedServer={fromPartial({ id: id || undefined, version: '2.8.0' })} />
    </MemoryRouter>,
  );

  it('contains links to different sections', () => {
    setUp();

    const links = screen.getAllByRole('link');

    expect.assertions(links.length + 1);
    expect(links).toHaveLength(6);
    links.forEach((link) => expect(link.getAttribute('href')).toContain('abc123'));
  });

  it.each([
    ['abc', true],
    [false, false],
  ])('contains a button to delete server if appropriate', (id, shouldHaveBtn) => {
    setUp(id as string | false);

    if (shouldHaveBtn) {
      expect(screen.getByText('DeleteServerButton')).toBeInTheDocument();
    } else {
      expect(screen.queryByText('DeleteServerButton')).not.toBeInTheDocument();
    }
  });
});
