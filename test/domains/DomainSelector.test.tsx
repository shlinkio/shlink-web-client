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
      Mock.of<ShlinkDomain>({ domain: 'foo.com' }),
      Mock.of<ShlinkDomain>({ domain: 'bar.com' }),
    ],
  });

  beforeEach(() => {
    wrapper = shallow(<DomainSelector domainsList={domainsList} listDomains={jest.fn()} onChange={jest.fn()} />);
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper.unmount());

  it('shows dropdown by default', () => {
    const input = wrapper.find(InputGroup);
    const dropdown = wrapper.find(DropdownBtn);

    expect(input).toHaveLength(0);
    expect(dropdown).toHaveLength(1);
    expect(dropdown.find(DropdownItem)).toHaveLength(4);
  });

  it('allows to toggle between dropdown and input', () => {
    wrapper.find(DropdownItem).last().simulate('click');
    expect(wrapper.find(InputGroup)).toHaveLength(1);
    expect(wrapper.find(DropdownBtn)).toHaveLength(0);

    wrapper.find('.domains-dropdown__back-btn').simulate('click');
    expect(wrapper.find(InputGroup)).toHaveLength(0);
    expect(wrapper.find(DropdownBtn)).toHaveLength(1);
  });
});
