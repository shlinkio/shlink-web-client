import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { UiSettings } from '../../src/settings/reducers/settings';
import { UserInterfaceSettings } from '../../src/settings/UserInterfaceSettings';
import { checkAccessibility } from '../__helpers__/accessibility';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<UserInterfaceSettings />', () => {
  const setUiSettings = vi.fn();
  const setUp = (ui?: UiSettings, defaultDarkTheme = false) => renderWithEvents(
    <UserInterfaceSettings
      settings={fromPartial({ ui })}
      setUiSettings={setUiSettings}
      _matchMedia={vi.fn().mockReturnValue({ matches: defaultDarkTheme })}
    />,
  );

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [{ theme: 'dark' as const }, true, true],
    [{ theme: 'dark' as const }, false, true],
    [{ theme: 'light' as const }, true, false],
    [{ theme: 'light' as const }, false, false],
    [undefined, false, false],
    [undefined, true, true],
  ])('toggles switch if theme is dark', (ui, defaultDarkTheme, expectedChecked) => {
    setUp(ui, defaultDarkTheme);

    if (expectedChecked) {
      expect(screen.getByLabelText('Use dark theme.')).toBeChecked();
    } else {
      expect(screen.getByLabelText('Use dark theme.')).not.toBeChecked();
    }
  });

  it.each([
    [{ theme: 'dark' as const }],
    [{ theme: 'light' as const }],
    [undefined],
  ])('shows different icons based on theme', (ui) => {
    setUp(ui);
    expect(screen.getByRole('img', { hidden: true })).toMatchSnapshot();
  });

  it.each([
    ['light' as const, 'dark' as const],
    ['dark' as const, 'light' as const],
  ])('invokes setUiSettings when theme toggle value changes', async (initialTheme, expectedTheme) => {
    const { user } = setUp({ theme: initialTheme });

    expect(setUiSettings).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText('Use dark theme.'));
    expect(setUiSettings).toHaveBeenCalledWith({ theme: expectedTheme });
  });
});
