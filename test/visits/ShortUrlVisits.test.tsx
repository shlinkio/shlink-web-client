import { screen } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { identity } from 'ramda';
import { MemoryRouter } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import type { ReportExporter } from '../../src/common/services/ReportExporter';
import type { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import type { Settings } from '../../src/settings/reducers/settings';
import type { ShortUrlDetail } from '../../src/short-urls/reducers/shortUrlDetail';
import type { ShortUrlVisits as ShortUrlVisitsState } from '../../src/visits/reducers/shortUrlVisits';
import type { ShortUrlVisitsProps } from '../../src/visits/ShortUrlVisits';
import { ShortUrlVisits as createShortUrlVisits } from '../../src/visits/ShortUrlVisits';
import type { Visit } from '../../src/visits/types';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlVisits />', () => {
  const getShortUrlVisitsMock = jest.fn();
  const exportVisits = jest.fn();
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
