import { screen } from '@testing-library/react';
import { Mock } from 'ts-mockery';
import { Settings } from '../../src/settings/reducers/settings';
import { VisitsSettings } from '../../src/settings/VisitsSettings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<VisitsSettings />', () => {
  const setVisitsSettings = vi.fn();
  const setUp = (settings: Partial<Settings> = {}) => renderWithEvents(
    <VisitsSettings settings={Mock.of<Settings>(settings)} setVisitsSettings={setVisitsSettings} />,
  );

  afterEach(vi.clearAllMocks);

  it('renders expected components', () => {
    setUp();

    expect(screen.getByRole('heading')).toHaveTextContent('Visits');
    expect(screen.getByText('Default interval to load on visits sections:')).toBeInTheDocument();
    expect(screen.getByText(/^Exclude bots wherever possible/)).toBeInTheDocument();
  });

  it.each([
    [Mock.all<Settings>(), 'Last 30 days'],
    [Mock.of<Settings>({ visits: {} }), 'Last 30 days'],
    [
      Mock.of<Settings>({
        visits: {
          defaultInterval: 'last7Days',
        },
      }),
      'Last 7 days',
    ],
    [
      Mock.of<Settings>({
        visits: {
          defaultInterval: 'today',
        },
      }),
      'Today',
    ],
  ])('sets expected interval as active', (settings, expectedInterval) => {
    setUp(settings);
    expect(screen.getByRole('button')).toHaveTextContent(expectedInterval);
  });

  it('invokes setVisitsSettings when interval changes', async () => {
    const { user } = setUp();
    const selectOption = async (name: string) => {
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByRole('menuitem', { name }));
    };

    await selectOption('Last 7 days');
    await selectOption('Last 180 days');
    await selectOption('Yesterday');

    expect(setVisitsSettings).toHaveBeenCalledTimes(3);
    expect(setVisitsSettings).toHaveBeenNthCalledWith(1, { defaultInterval: 'last7Days' });
    expect(setVisitsSettings).toHaveBeenNthCalledWith(2, { defaultInterval: 'last180Days' });
    expect(setVisitsSettings).toHaveBeenNthCalledWith(3, { defaultInterval: 'yesterday' });
  });

  it.each([
    [
      Mock.all<Settings>(),
      /The visits coming from potential bots will be included.$/,
      /The visits coming from potential bots will be excluded.$/,
    ],
    [
      Mock.of<Settings>({ visits: { excludeBots: false } }),
      /The visits coming from potential bots will be included.$/,
      /The visits coming from potential bots will be excluded.$/,
    ],
    [
      Mock.of<Settings>({ visits: { excludeBots: true } }),
      /The visits coming from potential bots will be excluded.$/,
      /The visits coming from potential bots will be included.$/,
    ],
  ])('displays expected helper text for exclude bots control', (settings, expectedText, notExpectedText) => {
    setUp(settings);

    const visitsComponent = screen.getByText(/^Exclude bots wherever possible/);

    expect(visitsComponent).toHaveTextContent(expectedText);
    expect(visitsComponent).not.toHaveTextContent(notExpectedText);
  });

  it('invokes setVisitsSettings when bot exclusion is toggled', async () => {
    const { user } = setUp();

    await user.click(screen.getByText(/^Exclude bots wherever possible/));
    expect(setVisitsSettings).toHaveBeenCalledWith(expect.objectContaining({ excludeBots: true }));
  });
});
