import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button, ModalHeader } from 'reactstrap';
import { ShlinkDomain } from '../../../src/api/types';
import { EditDomainRedirectsModal } from '../../../src/domains/helpers/EditDomainRedirectsModal';
import { InfoTooltip } from '../../../src/utils/InfoTooltip';

describe('<EditDomainRedirectsModal />', () => {
  let wrapper: ShallowWrapper;
  const editDomainRedirects = jest.fn().mockResolvedValue(undefined);
  const toggle = jest.fn();
  const domain = Mock.of<ShlinkDomain>({
    domain: 'foo.com',
    redirects: {
      baseUrlRedirect: 'baz',
    },
  });

  beforeEach(() => {
    wrapper = shallow(
      <EditDomainRedirectsModal domain={domain} isOpen toggle={toggle} editDomainRedirects={editDomainRedirects} />,
    );
  });

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders domain in header', () => {
    const header = wrapper.find(ModalHeader);

    expect(header.html()).toContain('foo.com');
  });

  it('expected amount of form groups and tooltips', () => {
    const formGroups = wrapper.find('FormGroup');
    const tooltips = wrapper.find(InfoTooltip);

    expect(formGroups).toHaveLength(3);
    expect(tooltips).toHaveLength(3);
  });

  it('has different handlers to toggle the modal', () => {
    expect(toggle).not.toHaveBeenCalled();

    (wrapper.prop('toggle') as Function)();
    (wrapper.find(ModalHeader).prop('toggle') as Function)();
    wrapper.find(Button).first().simulate('click');

    expect(toggle).toHaveBeenCalledTimes(3);
  });

  it('saves expected values when form is submitted', () => {
    const formGroups = wrapper.find('FormGroup');

    expect(editDomainRedirects).not.toHaveBeenCalled();

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'baz',
      regular404Redirect: null,
      invalidShortUrlRedirect: null,
    });

    formGroups.at(0).simulate('change', 'new_base_url');
    formGroups.at(2).simulate('change', 'new_invalid_short_url');

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'new_base_url',
      regular404Redirect: null,
      invalidShortUrlRedirect: 'new_invalid_short_url',
    });

    formGroups.at(1).simulate('change', 'new_regular_404');
    formGroups.at(2).simulate('change', '');

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: 'new_base_url',
      regular404Redirect: 'new_regular_404',
      invalidShortUrlRedirect: null,
    });

    formGroups.at(0).simulate('change', '');
    formGroups.at(1).simulate('change', '');
    formGroups.at(2).simulate('change', '');

    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });
    expect(editDomainRedirects).toHaveBeenCalledWith('foo.com', {
      baseUrlRedirect: null,
      regular404Redirect: null,
      invalidShortUrlRedirect: null,
    });
  });
});
