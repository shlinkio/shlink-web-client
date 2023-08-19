import type { Theme } from '@shlinkio/shlink-frontend-kit';
import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { UiSettings } from '../../src/settings/reducers/settings';
import { UserInterfaceSettings } from '../../src/settings/UserInterfaceSettings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<UserInterfaceSettings />', () => {
  const setUiSettings = vi.fn();
  const setUp = (ui?: UiSettings) => renderWithEvents(
    <UserInterfaceSettings settings={fromPartial({ ui })} setUiSettings={setUiSettings} />,
  );

  it.each([
    [{ theme: 'dark' as Theme }, true],
    [{ theme: 'light' as Theme }, false],
    [undefined, false],
  ])('toggles switch if theme is dark', (ui, expectedChecked) => {
    setUp(ui);

    if (expectedChecked) {
      expect(screen.getByLabelText('Use dark theme.')).toBeChecked();
    } else {
      expect(screen.getByLabelText('Use dark theme.')).not.toBeChecked();
    }
  });

  it.each([
    [{ theme: 'dark' as Theme }],
    [{ theme: 'light' as Theme }],
    [undefined],
  ])('shows different icons based on theme', (ui) => {
    setUp(ui);
    expect(screen.getByRole('img', { hidden: true })).toMatchSnapshot();
  });

  it.each([
    ['light' as Theme, 'dark' as Theme],
    ['dark' as Theme, 'light' as Theme],
  ])('invokes setUiSettings when theme toggle value changes', async (initialTheme, expectedTheme) => {
    const { user } = setUp({ theme: initialTheme });

    expect(setUiSettings).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Use dark theme.'));
    expect(setUiSettings).toHaveBeenCalledWith({ theme: expectedTheme });
  });
});
