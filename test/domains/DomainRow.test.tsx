import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { ShlinkDomainRedirects } from '../../src/api/types';
import { DomainRow } from '../../src/domains/DomainRow';
import { SelectedServer } from '../../src/servers/data';
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
