import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import type { ShortUrlCreationSettings as ShortUrlsSettings } from '../../src/settings/reducers/settings';
import { ShortUrlCreationSettings } from '../../src/settings/ShortUrlCreationSettings';
import { renderWithEvents } from '../__helpers__/setUpTest';

describe('<ShortUrlCreationSettings />', () => {
  const setShortUrlCreationSettings = vi.fn();
  const setUp = (shortUrlCreation?: ShortUrlsSettings) => renderWithEvents(
    <ShortUrlCreationSettings
      settings={fromPartial({ shortUrlCreation })}
      setShortUrlCreationSettings={setShortUrlCreationSettings}
    />,
  );

  it.each([
    [{ validateUrls: true }, true],
    [{ validateUrls: false }, false],
    [undefined, false],
  ])('URL validation switch has proper initial state', (shortUrlCreation, expectedChecked) => {
    const matcher = /^Request validation on long URLs when creating new short URLs/;

    setUp(shortUrlCreation);

    const checkbox = screen.getByLabelText(matcher);
    const label = screen.getByText(matcher);

    if (expectedChecked) {
      expect(checkbox).toBeChecked();
      expect(label).toHaveTextContent('Validate URL checkbox will be checked');
      expect(label).not.toHaveTextContent('Validate URL checkbox will be unchecked');
    } else {
      expect(checkbox).not.toBeChecked();
      expect(label).toHaveTextContent('Validate URL checkbox will be unchecked');
      expect(label).not.toHaveTextContent('Validate URL checkbox will be checked');
    }
  });

  it.each([
    [{ forwardQuery: true }, true],
    [{ forwardQuery: false }, false],
    [{}, true],
  ])('forward query switch is toggled if option is true', (shortUrlCreation, expectedChecked) => {
    const matcher = /^Make all new short URLs forward their query params to the long URL/;

    setUp({ validateUrls: true, ...shortUrlCreation });

    const checkbox = screen.getByLabelText(matcher);
    const label = screen.getByText(matcher);

    if (expectedChecked) {
      expect(checkbox).toBeChecked();
      expect(label).toHaveTextContent('Forward query params on redirect checkbox will be checked');
      expect(label).not.toHaveTextContent('Forward query params on redirect checkbox will be unchecked');
    } else {
      expect(checkbox).not.toBeChecked();
      expect(label).toHaveTextContent('Forward query params on redirect checkbox will be unchecked');
      expect(label).not.toHaveTextContent('Forward query params on redirect checkbox will be checked');
    }
  });

  it.each([
    [{ tagFilteringMode: 'includes' } as ShortUrlsSettings, 'Suggest tags including input', 'including'],
    [
      { tagFilteringMode: 'startsWith' } as ShortUrlsSettings,
      'Suggest tags starting with input',
      'starting with',
    ],
    [undefined, 'Suggest tags starting with input', 'starting with'],
  ])('shows expected texts for tags suggestions', (shortUrlCreation, expectedText, expectedHint) => {
    setUp(shortUrlCreation);

    expect(screen.getByRole('button', { name: expectedText })).toBeInTheDocument();
    expect(screen.getByText(/^The list of suggested tags will contain those/)).toHaveTextContent(expectedHint);
  });

  it.each([[true], [false]])('invokes setShortUrlCreationSettings when URL validation toggle value changes', async (validateUrls) => {
    const { user } = setUp({ validateUrls });

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText(/^Request validation on long URLs when creating new short URLs/));
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith({ validateUrls: !validateUrls });
  });

  it.each([[true], [false]])('invokes setShortUrlCreationSettings when forward query toggle value changes', async (forwardQuery) => {
    const { user } = setUp({ validateUrls: true, forwardQuery });

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText(/^Make all new short URLs forward their query params to the long URL/));
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining({ forwardQuery: !forwardQuery }));
  });

  it('invokes setShortUrlCreationSettings when dropdown value changes', async () => {
    const { user } = setUp();
    const clickItem = async (name: string) => {
      await user.click(screen.getByRole('button', { name: 'Suggest tags starting with input' }));
      await user.click(await screen.findByRole('menuitem', { name }));
    };

    expect(setShortUrlCreationSettings).not.toHaveBeenCalled();

    await clickItem('Suggest tags including input');
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining(
      { tagFilteringMode: 'includes' },
    ));

    await clickItem('Suggest tags starting with input');
    expect(setShortUrlCreationSettings).toHaveBeenCalledWith(expect.objectContaining(
      { tagFilteringMode: 'startsWith' },
    ));
  });
});
