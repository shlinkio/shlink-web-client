import { brandColor } from '@shlinkio/shlink-frontend-kit';
import { render } from '@testing-library/react';
import type { ShlinkLogoProps } from '../../../src/common/img/ShlinkLogo';
import { ShlinkLogo } from '../../../src/common/img/ShlinkLogo';
import { checkAccessibility } from '../../__helpers__/accessibility';

describe('<ShlinkLogo />', () => {
  const setUp = (props: ShlinkLogoProps = {}) => render(<ShlinkLogo {...props} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [undefined, brandColor()],
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
