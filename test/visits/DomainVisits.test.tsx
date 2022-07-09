import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { DomainVisits as createDomainVisits } from '../../src/visits/DomainVisits';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { DomainVisits } from '../../src/visits/reducers/domainVisits';
import { Settings } from '../../src/settings/reducers/settings';
import { SelectedServer } from '../../src/servers/data';
import { Visit } from '../../src/visits/types';
import { renderWithEvents } from '../__mocks__/setUpTest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ domain: 'foo.com_DEFAULT' }),
}));

describe('<DomainVisits />', () => {
  const exportVisits = jest.fn();
  const getDomainVisits = jest.fn();
  const cancelGetDomainVisits = jest.fn();
  const domainVisits = Mock.of<DomainVisits>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const DomainVisits = createDomainVisits(Mock.of<ReportExporter>({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <DomainVisits
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getDomainVisits={getDomainVisits}
        cancelGetDomainVisits={cancelGetDomainVisits}
        domainVisits={domainVisits}
        settings={Mock.all<Settings>()}
        selectedServer={Mock.all<SelectedServer>()}
      />
    </MemoryRouter>,
  );

  it('wraps visits stats and header', () => {
    setUp();
    expect(screen.getByRole('heading', { name: '"foo.com" visits' })).toBeInTheDocument();
    expect(getDomainVisits).toHaveBeenCalledWith('DEFAULT', expect.anything(), expect.anything());
  });

  it('exports visits when clicking the button', async () => {
    const { user } = setUp();
    const btn = screen.getByRole('button', { name: 'Export (1)' });

    expect(exportVisits).not.toHaveBeenCalled();
    expect(btn).toBeInTheDocument();

    await user.click(btn);
    expect(exportVisits).toHaveBeenCalledWith('domain_foo.com_visits.csv', expect.anything());
  });
});
