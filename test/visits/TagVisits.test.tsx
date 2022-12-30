import { screen } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { TagVisits as createTagVisits, TagVisitsProps } from '../../src/visits/TagVisits';
import { ColorGenerator } from '../../src/utils/services/ColorGenerator';
import { TagVisits as TagVisitsStats } from '../../src/visits/reducers/tagVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { Visit } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { renderWithEvents } from '../__helpers__/setUpTest';

vi.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: vi.fn().mockReturnValue({ tag: 'foo' }),
}));

describe('<TagVisits />', () => {
  const getTagVisitsMock = vi.fn();
  const exportVisits = vi.fn();
  const tagVisits = Mock.of<TagVisitsStats>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const TagVisits = createTagVisits(
    Mock.of<ColorGenerator>({ isColorLightForKey: () => false, getColorForKey: () => 'red' }),
    Mock.of<ReportExporter>({ exportVisits }),
  );
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <TagVisits
        {...Mock.all<TagVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getTagVisits={getTagVisitsMock}
        tagVisits={tagVisits}
        settings={Mock.all<Settings>()}
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
