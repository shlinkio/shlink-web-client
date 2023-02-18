import { screen } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import type { ReportExporter } from '../../src/common/services/ReportExporter';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { Settings } from '../../src/settings/reducers/settings';
import { NonOrphanVisits as createNonOrphanVisits } from '../../src/visits/NonOrphanVisits';
import type { VisitsInfo } from '../../src/visits/reducers/types';
import type { Visit } from '../../src/visits/types';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<NonOrphanVisits />', () => {
  const exportVisits = jest.fn();
  const getNonOrphanVisits = jest.fn();
  const cancelGetNonOrphanVisits = jest.fn();
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
