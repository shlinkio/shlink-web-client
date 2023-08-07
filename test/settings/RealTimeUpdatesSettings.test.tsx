import type { RealTimeUpdatesSettings as RealTimeUpdatesSettingsOptions } from '@shlinkio/shlink-web-component';
import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { RealTimeUpdatesSettings } from '../../src/settings/RealTimeUpdatesSettings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<RealTimeUpdatesSettings />', () => {
  const toggleRealTimeUpdates = vi.fn();
  const setRealTimeUpdatesInterval = vi.fn();
  const setUp = (realTimeUpdates: Partial<RealTimeUpdatesSettingsOptions> = {}) => renderWithEvents(
    <RealTimeUpdatesSettings
      settings={fromPartial({ realTimeUpdates })}
      toggleRealTimeUpdates={toggleRealTimeUpdates}
      setRealTimeUpdatesInterval={setRealTimeUpdatesInterval}
    />,
  );

  it('renders enabled real time updates as expected', () => {
    setUp({ enabled: true });

    expect(screen.getByLabelText(/^Enable or disable real-time updates./)).toBeChecked();
    expect(screen.getByText(/^Real-time updates are currently being/)).toHaveTextContent('processed');
    expect(screen.getByText(/^Real-time updates are currently being/)).not.toHaveTextContent('ignored');
    expect(screen.getByText('Real-time updates frequency (in minutes):')).not.toHaveAttribute(
      'class',
      expect.stringContaining('text-muted'),
    );
    expect(screen.getByLabelText('Real-time updates frequency (in minutes):')).not.toHaveAttribute('disabled');
    expect(screen.getByText('Updates will be reflected in the UI as soon as they happen.')).toBeInTheDocument();
  });

  it('renders disabled real time updates as expected', () => {
    setUp({ enabled: false });

    expect(screen.getByLabelText(/^Enable or disable real-time updates./)).not.toBeChecked();
    expect(screen.getByText(/^Real-time updates are currently being/)).not.toHaveTextContent('processed');
    expect(screen.getByText(/^Real-time updates are currently being/)).toHaveTextContent('ignored');
    expect(screen.getByText('Real-time updates frequency (in minutes):')).toHaveAttribute(
      'class',
      expect.stringContaining('text-muted'),
    );
    expect(screen.getByLabelText('Real-time updates frequency (in minutes):')).toHaveAttribute('disabled');
    expect(screen.queryByText('Updates will be reflected in the UI as soon as they happen.')).not.toBeInTheDocument();
  });

  it.each([
    [1, 'minute'],
    [2, 'minutes'],
    [10, 'minutes'],
    [100, 'minutes'],
  ])('shows expected children when interval is greater than 0', (interval, minutesWord) => {
    setUp({ enabled: true, interval });

    expect(screen.getByText(/^Updates will be reflected in the UI every/)).toHaveTextContent(
      `${interval} ${minutesWord}`,
    );
    expect(screen.getByLabelText('Real-time updates frequency (in minutes):')).toHaveValue(interval);
    expect(screen.queryByText('Updates will be reflected in the UI as soon as they happen.')).not.toBeInTheDocument();
  });

  it.each([[undefined], [0]])('shows expected children when interval is 0 or undefined', (interval) => {
    setUp({ enabled: true, interval });

    expect(screen.queryByText(/^Updates will be reflected in the UI every/)).not.toBeInTheDocument();
    expect(screen.getByText('Updates will be reflected in the UI as soon as they happen.')).toBeInTheDocument();
  });

  it('updates real time updates when typing on input', async () => {
    const { user } = setUp({ enabled: true });

    expect(setRealTimeUpdatesInterval).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('Real-time updates frequency (in minutes):'), '5');
    expect(setRealTimeUpdatesInterval).toHaveBeenCalledWith(5);
  });

  it('toggles real time updates on switch change', async () => {
    const { user } = setUp({ enabled: true });

    expect(toggleRealTimeUpdates).not.toHaveBeenCalled();
    await user.click(screen.getByText(/^Enable or disable real-time updates./));
    expect(toggleRealTimeUpdates).toHaveBeenCalled();
  });
});
