import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan as forbiddenIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomain, ShlinkDomainRedirects } from '../../src/api/types';
import { DomainRow } from '../../src/domains/DomainRow';

describe('<DomainRow />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (domain: ShlinkDomain) => {
    wrapper = shallow(<DomainRow domain={domain} editDomainRedirects={jest.fn()} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [ Mock.of<ShlinkDomain>({ domain: '', isDefault: true }), 1 ],
    [ Mock.of<ShlinkDomain>({ domain: '', isDefault: false }), 0 ],
  ])('shows proper components based on the fact that provided domain is default or not', (domain, expectedComps) => {
    const wrapper = createWrapper(domain);
    const defaultDomainComp = wrapper.find('td').first().find('DefaultDomain');
    const tooltip = wrapper.find(UncontrolledTooltip);
    const button = wrapper.find(Button);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(defaultDomainComp).toHaveLength(expectedComps);
    expect(tooltip).toHaveLength(expectedComps);
    expect(button.prop('disabled')).toEqual(domain.isDefault);
    expect(icon.prop('icon')).toEqual(domain.isDefault ? forbiddenIcon : editIcon);
  });

  it.each([
    [ undefined, 3 ],
    [ Mock.of<ShlinkDomainRedirects>(), 3 ],
    [ Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'foo' }), 2 ],
    [ Mock.of<ShlinkDomainRedirects>({ invalidShortUrlRedirect: 'foo' }), 2 ],
    [ Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'foo', regular404Redirect: 'foo' }), 1 ],
    [
      Mock.of<ShlinkDomainRedirects>(
        { baseUrlRedirect: 'foo', regular404Redirect: 'foo', invalidShortUrlRedirect: 'foo' },
      ),
      0,
    ],
  ])('shows expected redirects', (redirects, expectedNoRedirects) => {
    const wrapper = createWrapper(Mock.of<ShlinkDomain>({ domain: '', isDefault: true, redirects }));
    const noRedirects = wrapper.find('Nr');
    const cells = wrapper.find('td');

    expect(noRedirects).toHaveLength(expectedNoRedirects);
    redirects?.baseUrlRedirect && expect(cells.at(1).html()).toContain(redirects.baseUrlRedirect);
    redirects?.regular404Redirect && expect(cells.at(2).html()).toContain(redirects.regular404Redirect);
    redirects?.invalidShortUrlRedirect && expect(cells.at(3).html()).toContain(redirects.invalidShortUrlRedirect);
  });
});
