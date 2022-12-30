import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { OrphanVisits as createOrphanVisits } from '../../src/visits/OrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { Visit } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { VisitsInfo } from '../../src/visits/reducers/types';

describe('<OrphanVisits />', () => {
  const getOrphanVisits = vi.fn();
  const exportVisits = vi.fn();
  const orphanVisits = Mock.of<VisitsInfo>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const OrphanVisits = createOrphanVisits(Mock.of<ReportExporter>({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <OrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getOrphanVisits={getOrphanVisits}
        orphanVisits={orphanVisits}
        cancelGetOrphanVisits={vi.fn()}
        settings={Mock.all<Settings>()}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getByRole('heading', { name: 'Orphan visits' })).toBeInTheDocument();
    expect(getOrphanVisits).toHaveBeenCalled();
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('orphan_visits.csv', expect.anything());
  });
});
