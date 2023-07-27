import { render, screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router';
import { AsideMenu } from '../../shlink-web-component/common/AsideMenu';

describe('<AsideMenu />', () => {
  const setUp = () => render(
    <MemoryRouter>
      <AsideMenu selectedServer={fromPartial({ id: 'abc123', version: '2.8.0' })} />
    </MemoryRouter>,
  );

  it('contains links to different sections', () => {
    setUp();

    const links = screen.getAllByRole('link');

    expect.assertions(links.length + 1);
    expect(links).toHaveLength(5);
    links.forEach((link) => expect(link.getAttribute('href')).toContain('abc123'));
  });
});
