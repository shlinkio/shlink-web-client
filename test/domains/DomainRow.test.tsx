import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan as forbiddenIcon, faEdit as editIcon } from '@fortawesome/free-solid-svg-icons';
import { ShlinkDomainRedirects } from '../../src/api/types';
import { DomainRow } from '../../src/domains/DomainRow';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { Domain } from '../../src/domains/data';

describe('<DomainRow />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (domain: Domain, selectedServer = Mock.all<SelectedServer>()) => {
    wrapper = shallow(
      <DomainRow
        domain={domain}
        selectedServer={selectedServer}
        editDomainRedirects={jest.fn()}
        checkDomainHealth={jest.fn()}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [Mock.of<Domain>({ domain: '', isDefault: true }), undefined, 1, 1, 'defaultDomainBtn'],
    [Mock.of<Domain>({ domain: '', isDefault: false }), undefined, 0, 0, undefined],
    [Mock.of<Domain>({ domain: 'foo.com', isDefault: true }), undefined, 1, 1, 'defaultDomainBtn'],
    [Mock.of<Domain>({ domain: 'foo.bar.com', isDefault: true }), undefined, 1, 1, 'defaultDomainBtn'],
    [Mock.of<Domain>({ domain: 'foo.baz', isDefault: false }), undefined, 0, 0, undefined],
    [
      Mock.of<Domain>({ domain: 'foo.baz', isDefault: true }),
      Mock.of<ReachableServer>({ version: '2.10.0' }),
      1,
      0,
      undefined,
    ],
    [
      Mock.of<Domain>({ domain: 'foo.baz', isDefault: true }),
      Mock.of<ReachableServer>({ version: '2.9.0' }),
      1,
      1,
      'defaultDomainBtn',
    ],
    [
      Mock.of<Domain>({ domain: 'foo.baz', isDefault: false }),
      Mock.of<ReachableServer>({ version: '2.9.0' }),
      0,
      0,
      undefined,
    ],
    [
      Mock.of<Domain>({ domain: 'foo.baz', isDefault: false }),
      Mock.of<ReachableServer>({ version: '2.10.0' }),
      0,
      0,
      undefined,
    ],
  ])('shows proper components based on provided domain and selectedServer', (
    domain,
    selectedServer,
    expectedDefaultDomainIcons,
    expectedDisabledComps,
    expectedDomainId,
  ) => {
    const wrapper = createWrapper(domain, selectedServer);
    const defaultDomainComp = wrapper.find('td').first().find('DefaultDomain');
    const disabledBtn = wrapper.find(Button).findWhere((btn) => !!btn.prop('disabled'));
    const tooltip = wrapper.find(UncontrolledTooltip);
    const button = wrapper.find(Button);
    const icon = wrapper.find(FontAwesomeIcon);

    expect(defaultDomainComp).toHaveLength(expectedDefaultDomainIcons);
    expect(disabledBtn).toHaveLength(expectedDisabledComps);
    expect(button.prop('disabled')).toEqual(expectedDisabledComps > 0);
    expect(icon.prop('icon')).toEqual(expectedDisabledComps > 0 ? forbiddenIcon : editIcon);
    expect(tooltip).toHaveLength(expectedDisabledComps);

    if (expectedDisabledComps > 0) {
      expect(tooltip.prop('target')).toEqual(expectedDomainId);
    }
  });

  it.each([
    [undefined, 3],
    [Mock.of<ShlinkDomainRedirects>(), 3],
    [Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'foo' }), 2],
    [Mock.of<ShlinkDomainRedirects>({ invalidShortUrlRedirect: 'foo' }), 2],
    [Mock.of<ShlinkDomainRedirects>({ baseUrlRedirect: 'foo', regular404Redirect: 'foo' }), 1],
    [
      Mock.of<ShlinkDomainRedirects>(
        { baseUrlRedirect: 'foo', regular404Redirect: 'foo', invalidShortUrlRedirect: 'foo' },
      ),
      0,
    ],
  ])('shows expected redirects', (redirects, expectedNoRedirects) => {
    const wrapper = createWrapper(Mock.of<Domain>({ domain: '', isDefault: true, redirects }));
    const noRedirects = wrapper.find('Nr');
    const cells = wrapper.find('td');

    expect(noRedirects).toHaveLength(expectedNoRedirects);
    redirects?.baseUrlRedirect && expect(cells.at(1).html()).toContain(redirects.baseUrlRedirect);
    redirects?.regular404Redirect && expect(cells.at(2).html()).toContain(redirects.regular404Redirect);
    redirects?.invalidShortUrlRedirect && expect(cells.at(3).html()).toContain(redirects.invalidShortUrlRedirect);
  });
});
