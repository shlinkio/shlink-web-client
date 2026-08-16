import { brandColor } from '@shlinkio/shlink-frontend-kit';
import type { ShlinkLogoProps } from '../../../src/common/img/ShlinkLogo';
import { ShlinkLogo } from '../../../src/common/img/ShlinkLogo';
import { checkAccessibility } from '../../__helpers__/accessibility';
import { render } from '../../__helpers__/setUpTest.tsx';

describe('<ShlinkLogo />', () => {
  const setUp = (props: ShlinkLogoProps = {}) => render(<ShlinkLogo {...props} />);

  it('passes a11y checks', () => checkAccessibility(setUp()));

  it.each([
    [undefined, brandColor()],
    ['red', 'red'],
    ['white', 'white'],
  ])('renders expected color', async (color, expectedColor) => {
    const { container } = await setUp({ color });
    await expect.element(container.querySelector('g')).toHaveAttribute('fill', expectedColor);
  });

  it.each([
    [undefined, undefined],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('renders expected class', async (className, expectedClassName) => {
    const { container } = await setUp({ className });

    if (expectedClassName) {
      await expect.element(container.firstChild as HTMLElement).toHaveAttribute('class', expectedClassName);
    } else {
      await expect.element(container.firstChild as HTMLElement).not.toHaveAttribute('class');
    }
  });
});
