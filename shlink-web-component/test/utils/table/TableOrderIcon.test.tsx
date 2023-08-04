import { render } from '@testing-library/react';
import type { OrderDir } from '../../../../shlink-frontend-kit/src';
import { TableOrderIcon } from '../../../src/utils/table/TableOrderIcon';

describe('<TableOrderIcon />', () => {
  const setUp = (field: string, currentDir?: OrderDir, className?: string) => render(
    <TableOrderIcon currentOrder={{ dir: currentDir, field: 'foo' }} field={field} className={className} />,
  );

  it.each([
    ['foo', undefined],
    ['bar', 'DESC' as OrderDir],
    ['bar', 'ASC' as OrderDir],
  ])('renders empty when not all conditions are met', (field, dir) => {
    const { container } = setUp(field, dir);
    expect(container.firstChild).toBeNull();
  });

  it.each([
    ['DESC' as OrderDir],
    ['ASC' as OrderDir],
  ])('renders an icon when all conditions are met', (dir) => {
    const { container } = setUp('foo', dir);

    expect(container.firstChild).not.toBeNull();
    expect(container.firstChild).toMatchSnapshot();
  });

  it.each([
    [undefined, 'ms-1'],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('renders expected classname', (className, expectedClassName) => {
    const { container } = setUp('foo', 'ASC', className);
    expect(container.firstChild).toHaveClass(expectedClassName);
  });
});
