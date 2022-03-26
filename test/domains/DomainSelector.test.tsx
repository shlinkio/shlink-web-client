import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DropdownItem, InputGroup } from 'reactstrap';
import { DomainSelector } from '../../src/domains/DomainSelector';
import { DomainsList } from '../../src/domains/reducers/domainsList';
import { ShlinkDomain } from '../../src/api/types';
import { DropdownBtn } from '../../src/utils/DropdownBtn';

describe('<DomainSelector />', () => {
  let wrapper: ShallowWrapper;
  const domainsList = Mock.of<DomainsList>({
    domains: [
      Mock.of<ShlinkDomain>({ domain: 'default.com', isDefault: true }),
      Mock.of<ShlinkDomain>({ domain: 'foo.com' }),
      Mock.of<ShlinkDomain>({ domain: 'bar.com' }),
    ],
  });
  const createWrapper = (value = '') => {
    wrapper = shallow(
      <DomainSelector value={value} domainsList={domainsList} listDomains={jest.fn()} onChange={jest.fn()} />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper.unmount());

  it.each([
    ['', 'Domain', 'domains-dropdown__toggle-btn'],
    ['my-domain.com', 'Domain: my-domain.com', 'domains-dropdown__toggle-btn--active'],
  ])('shows dropdown by default', (value, expectedText, expectedClassName) => {
    const wrapper = createWrapper(value);
    const input = wrapper.find(InputGroup);
    const dropdown = wrapper.find(DropdownBtn);

    expect(input).toHaveLength(0);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.find(DropdownItem)).toHaveLength(5);
    expect(dropdown.prop('text')).toEqual(expectedText);
    expect(dropdown.prop('className')).toEqual(expectedClassName);
  });

  it('allows toggling between dropdown and input', () => {
    const wrapper = createWrapper();

    wrapper.find(DropdownItem).last().simulate('click');
    expect(wrapper.find(InputGroup)).toHaveLength(1);
    expect(wrapper.find(DropdownBtn)).toHaveLength(0);

    wrapper.find('.domains-dropdown__back-btn').simulate('click');
    expect(wrapper.find(InputGroup)).toHaveLength(0);
    expect(wrapper.find(DropdownBtn)).toHaveLength(1);
  });

  it.each([
    [0, 'default.com<span class="float-end text-muted">default</span>'],
    [1, 'foo.com'],
    [2, 'bar.com'],
  ])('shows expected content on every item', (index, expectedContent) => {
    const item = createWrapper().find(DropdownItem).at(index);

    expect(item.html()).toContain(expectedContent);
  });
});
