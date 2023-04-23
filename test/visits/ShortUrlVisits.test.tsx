import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { formatISO } from 'date-fns';
import { identity } from 'ramda';
import { MemoryRouter } from 'react-router-dom';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { ShortUrlVisits as ShortUrlVisitsState } from '../../src/visits/reducers/shortUrlVisits';
import type { ShortUrlVisitsProps } from '../../src/visits/ShortUrlVisits';
import { ShortUrlVisits as createShortUrlVisits } from '../../src/visits/ShortUrlVisits';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlVisits />', () => {
  const getShortUrlVisitsMock = jest.fn();
  const exportVisits = jest.fn();
  const shortUrlVisits = fromPartial<ShortUrlVisitsState>({ visits: [{ date: formatISO(new Date()) }] });
  const ShortUrlVisits = createShortUrlVisits(fromPartial({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <ShortUrlVisits
        {...fromPartial<ShortUrlVisitsProps>({})}
        {...fromPartial<MercureBoundProps>({ mercureInfo: {} })}
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        shortUrlVisits={shortUrlVisits}
        shortUrlDetail={fromPartial({})}
        settings={fromPartial({})}
        cancelGetShortUrlVisits={() => {}}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Visits for');
    expect(getShortUrlVisitsMock).toHaveBeenCalled();
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('short-url_undefined_visits.csv', expect.anything());
  });
});
