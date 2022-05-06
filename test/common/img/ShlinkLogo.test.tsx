import { render } from '@testing-library/react';
import { ShlinkLogo, ShlinkLogoProps } from '../../../src/common/img/ShlinkLogo';
import { MAIN_COLOR } from '../../../src/utils/theme';

describe('<ShlinkLogo />', () => {
  const setUp = (props: ShlinkLogoProps) => render(<ShlinkLogo {...props} />);

  it.each([
    [undefined, MAIN_COLOR],
    ['red', 'red'],
    ['white', 'white'],
  ])('renders expected color', (color, expectedColor) => {
    const { container } = setUp({ color });
    expect(container.querySelector('g')).toHaveAttribute('fill', expectedColor);
  });

  it.each([
    [undefined, undefined],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('renders expected class', (className, expectedClassName) => {
    const { container } = setUp({ className });

    if (expectedClassName) {
      expect(container.firstChild).toHaveAttribute('class', expectedClassName);
    } else {
      expect(container.firstChild).not.toHaveAttribute('class');
    }
  });
});
