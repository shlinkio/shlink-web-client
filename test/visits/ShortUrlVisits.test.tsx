import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { ShortUrlVisits as createShortUrlVisits, ShortUrlVisitsProps } from '../../src/visits/ShortUrlVisits';
import { ShortUrlVisits as ShortUrlVisitsState } from '../../src/visits/reducers/shortUrlVisits';
import { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { ReportExporter } from '../../src/common/services/ReportExporter';
import { Visit } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlVisits />', () => {
  const getShortUrlVisitsMock = vi.fn();
  const exportVisits = vi.fn();
  const shortUrlVisits = Mock.of<ShortUrlVisitsState>({ visits: [Mock.of<Visit>({ date: formatISO(new Date()) })] });
  const ShortUrlVisits = createShortUrlVisits(Mock.of<ReportExporter>({ exportVisits }));
  const setUp = () => renderWithEvents(
    <MemoryRouter>
      <ShortUrlVisits
        {...Mock.all<ShortUrlVisitsProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        getShortUrlDetail={identity}
        getShortUrlVisits={getShortUrlVisitsMock}
        shortUrlVisits={shortUrlVisits}
        shortUrlDetail={Mock.all<ShortUrlDetail>()}
        settings={Mock.all<Settings>()}
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
