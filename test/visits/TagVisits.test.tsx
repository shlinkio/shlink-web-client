import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { formatISO } from 'date-fns';
import { MemoryRouter } from 'react-router';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { TagVisits as TagVisitsStats } from '../../src/shlink-web-component/visits/reducers/tagVisits';
import type { TagVisitsProps } from '../../src/shlink-web-component/visits/TagVisits';
import { TagVisits as createTagVisits } from '../../src/shlink-web-component/visits/TagVisits';
import { renderWithEvents } from '../__helpers__/setUpTest';

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useParams: vi.fn().mockReturnValue({ tag: 'foo' }),
}));

describe('<TagVisits />', () => {
  const getTagVisitsMock = vi.fn();
  const exportVisits = vi.fn();
  const tagVisits = fromPartial<TagVisitsStats>({ visits: [{ date: formatISO(new Date()) }] });
  const TagVisits = createTagVisits(
    fromPartial({ isColorLightForKey: () => false, getColorForKey: () => 'red' }),
    fromPartial({ exportVisits }),
  );
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <TagVisits
        {...fromPartial<TagVisitsProps>({})}
        {...fromPartial<MercureBoundProps>({ mercureInfo: {} })}
        getTagVisits={getTagVisitsMock}
        tagVisits={tagVisits}
        settings={fromPartial({})}
        cancelGetTagVisits={() => {}}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent('Visits for');
    expect(getTagVisitsMock).toHaveBeenCalled();
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('tag_foo_visits.csv', expect.anything());
  });
});
