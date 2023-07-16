import { render, screen } from '@testing-library/react';
import { ShortUrlFormCheckboxGroup } from '../../../src/shlink-web-component/short-urls/helpers/ShortUrlFormCheckboxGroup';

describe('<ShortUrlFormCheckboxGroup />', () => {
  it.each([
    [undefined, '', 0],
    ['This is the tooltip', 'me-2', 1],
  ])('renders tooltip only when provided', (infoTooltip, expectedClassName, expectedAmountOfTooltips) => {
    render(<ShortUrlFormCheckboxGroup infoTooltip={infoTooltip} />);

    expect(screen.getByRole('checkbox').parentNode).toHaveAttribute(
      'class',
      expect.stringContaining(expectedClassName),
    );
    expect(screen.queryAllByRole('img', { hidden: true })).toHaveLength(expectedAmountOfTooltips);
  });
});
