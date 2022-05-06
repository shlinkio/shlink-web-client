import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { NonOrphanVisits as createNonOrphanVisits } from '../../src/visits/NonOrphanVisits';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { Visit, VisitsInfo } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { SelectedServer } from '../../src/servers/data';

describe('<NonOrphanVisits />', () => {
  const exportVisits = jest.fn();
  const getNonOrphanVisits = jest.fn();
  const cancelGetNonOrphanVisits = jest.fn();
  const nonOrphanVisits = Mock.of<VisitsInfo>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const NonOrphanVisits = createNonOrphanVisits(Mock.of<ReportExporter>({ exportVisits }));

  beforeEach(() => render(
    <MemoryRouter>
      <NonOrphanVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getNonOrphanVisits={getNonOrphanVisits}
        cancelGetNonOrphanVisits={cancelGetNonOrphanVisits}
        nonOrphanVisits={nonOrphanVisits}
        settings={Mock.all<Settings>()}
        selectedServer={Mock.all<SelectedServer>()}
      />
    </MemoryRouter>,
  ));

  it('wraps visits stats and header', () => {
    expect(screen.getByRole('heading', { name: 'Non-orphan visits' })).toBeInTheDocument();
    expect(getNonOrphanVisits).toHaveBeenCalled();
  });

  it('exports visits when clicking the button', () => {
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('non_orphan_visits.csv', expect.anything());
  });
});
