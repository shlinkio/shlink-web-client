import { shallow, ShallowWrapper } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { ExportBtn } from '../../src/utils/ExportBtn';

describe('<ExportBtn />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (amount?: number, loading = false) => {
    wrapper = shallow(<ExportBtn amount={amount} loading={loading} />);

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [true, 'Exporting...'],
    [false, 'Export ('],
  ])('renders a button', (loading, text) => {
    const wrapper = createWrapper(undefined, loading);

    expect(wrapper.prop('outline')).toEqual(true);
    expect(wrapper.prop('color')).toEqual('primary');
    expect(wrapper.prop('disabled')).toEqual(loading);
    expect(wrapper.html()).toContain(text);
  });

  it.each([
    [undefined, '0'],
    [10, '10'],
    [10_000, '10,000'],
    [10_000_000, '10,000,000'],
  ])('renders expected amount', (amount, expectedRenderedAmount) => {
    const wrapper = createWrapper(amount);

    expect(wrapper.html()).toContain(`Export (${expectedRenderedAmount})`);
  });

  it('renders expected icon', () => {
    const wrapper = createWrapper();
    const icon = wrapper.find(FontAwesomeIcon);

    expect(icon).toHaveLength(1);
    expect(icon.prop('icon')).toEqual(faFileDownload);
  });
});
