import { screen, waitFor } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { VisitsStats } from '../../src/visits/VisitsStats';
import { Visit } from '../../src/visits/types';
import { Settings } from '../../src/settings/reducers/settings';
import { ReachableServer } from '../../src/servers/data';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { rangeOf } from '../../src/utils/utils';
import { VisitsInfo } from '../../src/visits/reducers/types';

describe('<VisitsStats />', () => {
  const visits = rangeOf(3, () => Mock.of<Visit>({ date: '2020-01-01' }));
  const getVisitsMock = jest.fn();
  const exportCsv = jest.fn();
  const setUp = (visitsInfo: Partial<VisitsInfo>, activeRoute = '/by-time') => {
    const history = createMemoryHistory();
    history.push(activeRoute);

    return {
      history,
      ...renderWithEvents(
        <Router location={history.location} navigator={history}>
          <VisitsStats
            getVisits={getVisitsMock}
            visitsInfo={Mock.of<VisitsInfo>(visitsInfo)}
            cancelGetVisits={() => {}}
            settings={Mock.all<Settings>()}
            exportCsv={exportCsv}
            selectedServer={Mock.of<ReachableServer>({ version: '3.0.0' })}
          />
        </Router>,
      ),
    };
  };

  it('renders a preloader when visits are loading', () => {
    setUp({ loading: true, visits: [] });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText(/^This is going to take a while/)).not.toBeInTheDocument();
  });

  it('renders a warning and progress bar when loading large amounts of visits', () => {
    setUp({ loading: true, loadingLarge: true, visits: [], progress: 25 });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(/^This is going to take a while/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('renders an error message when visits could not be loaded', () => {
    setUp({ loading: false, error: true, visits: [] });
    expect(screen.getByText('An error occurred while loading visits :(')).toBeInTheDocument();
  });

  it('renders a message when visits are loaded but the list is empty', () => {
    setUp({ loading: false, error: false, visits: [] });
    expect(screen.getByText('There are no visits matching current filter')).toBeInTheDocument();
  });

  it.each([
    ['/by-time', 2],
    ['/by-context', 4],
    ['/by-location', 3],
    ['/list', 1],
  ])('renders expected amount of charts', (route, expectedCharts) => {
    const { container } = setUp({ loading: false, error: false, visits }, route);
    expect(container.querySelectorAll('.card')).toHaveLength(expectedCharts);
  });

  it('holds the map button on cities chart header', () => {
    setUp({ loading: false, error: false, visits }, '/by-location');
    expect(
      screen.getAllByRole('img', { hidden: true }).some((icon) => icon.classList.contains('fa-map-location-dot')),
    ).toEqual(true);
  });

  it('exports CSV when export btn is clicked', async () => {
    const { user } = setUp({ visits });

    expect(exportCsv).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /Export/ }));
    expect(exportCsv).toHaveBeenCalled();
  });

  it('sets filters in query string', async () => {
    const { history, user } = setUp({ visits });
    const expectSearchContains = (contains: string[]) => {
      expect(contains).not.toHaveLength(0);
      contains.forEach((entry) => expect(history.location.search).toContain(entry));
    };

    expect(history.location.search).toEqual('');

    await user.click(screen.getByRole('button', { name: /Filters/ }));
    await waitFor(() => screen.getByRole('menu'));
    await user.click(screen.getByRole('menuitem', { name: 'Exclude potential bots' }));
    expectSearchContains(['excludeBots=true']);

    await user.click(screen.getByRole('button', { name: /Last 30 days/ }));
    await waitFor(() => screen.getByRole('menu'));
    await user.click(screen.getByRole('menuitem', { name: /Last 180 days/ }));
    expectSearchContains(['startDate', 'endDate']);
  });
});
