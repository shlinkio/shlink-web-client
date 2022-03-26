import { shallow, ShallowWrapper } from 'enzyme';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { TableOrderIcon } from '../../../src/utils/table/TableOrderIcon';
import { OrderDir } from '../../../src/utils/helpers/ordering';

describe('<TableOrderIcon />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (field: string, currentDir?: OrderDir, className?: string) => {
    wrapper = shallow(
      <TableOrderIcon currentOrder={{ dir: currentDir, field: 'foo' }} field={field} className={className} />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    ['foo', undefined],
    ['bar', 'DESC' as OrderDir],
    ['bar', 'ASC' as OrderDir],
  ])('renders empty when not all conditions are met', (field, dir) => {
    const wrapper = createWrapper(field, dir);

    expect(wrapper.html()).toEqual(null);
  });

  it.each([
    ['DESC' as OrderDir, caretDownIcon],
    ['ASC' as OrderDir, caretUpIcon],
  ])('renders an icon when all conditions are met', (dir, expectedIcon) => {
    const wrapper = createWrapper('foo', dir);

    expect(wrapper.html()).not.toEqual(null);
    expect(wrapper.prop('icon')).toEqual(expectedIcon);
  });

  it.each([
    [undefined, 'ms-1'],
    ['foo', 'foo'],
    ['bar', 'bar'],
  ])('renders expected classname', (className, expectedClassName) => {
    const wrapper = createWrapper('foo', 'ASC', className);

    expect(wrapper.prop('className')).toEqual(expectedClassName);
  });
});
