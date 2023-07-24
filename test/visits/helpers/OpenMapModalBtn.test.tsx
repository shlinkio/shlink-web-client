import { screen, waitFor } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { OpenMapModalBtn } from '../../../shlink-web-component/visits/helpers/OpenMapModalBtn';
import type { CityStats } from '../../../shlink-web-component/visits/types';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<OpenMapModalBtn />', () => {
  const title = 'Foo';
  const locations: CityStats[] = [
    fromPartial({ cityName: 'foo', count: 30, latLong: [5, 5] }),
    fromPartial({ cityName: 'bar', count: 45, latLong: [88, 88] }),
  ];
  const setUp = (activeCities?: string[]) => renderWithEvents(
    <OpenMapModalBtn modalTitle={title} locations={locations} activeCities={activeCities} />,
  );

  it('renders tooltip on button hover and opens modal on click', async () => {
    const { user } = setUp();

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens dropdown instead of modal when a list of active cities has been provided', async () => {
    const { user } = setUp(['bar']);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each([
    ['Show all locations'],
    ['Show locations in current page'],
  ])('filters out non-active cities from list of locations', async (name) => {
    const { user } = setUp(['bar']);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name }));

    expect(await screen.findByRole('dialog')).toMatchSnapshot();
  });
});
