import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { NonOrphanVisits as createNonOrphanVisits } from '../../src/visits/NonOrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { Visit } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { VisitsInfo } from '../../src/visits/reducers/types';

describe('<NonOrphanVisits />', () => {
  const exportVisits = vi.fn();
  const getNonOrphanVisits = vi.fn();
  const cancelGetNonOrphanVisits = vi.fn();
  const nonOrphanVisits = Mock.of<VisitsInfo>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const NonOrphanVisits = createNonOrphanVisits(Mock.of<ReportExporter>({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <NonOrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getNonOrphanVisits={getNonOrphanVisits}
        cancelGetNonOrphanVisits={cancelGetNonOrphanVisits}
        nonOrphanVisits={nonOrphanVisits}
        settings={Mock.all<Settings>()}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getByRole('heading', { name: 'Non-orphan visits' })).toBeInTheDocument();
    expect(getNonOrphanVisits).toHaveBeenCalled();
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('non_orphan_visits.csv', expect.anything());
  });
});
