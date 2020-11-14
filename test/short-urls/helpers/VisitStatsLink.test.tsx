import { shallow, ShallowWrapper } from 'enzyme';
import { Link } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import VisitStatsLink from '../../../src/short-urls/helpers/VisitStatsLink';
import { NotFoundServer, ReachableServer } from '../../../src/servers/data';
import { ShortUrl } from '../../../src/short-urls/data';

describe('<VisitStatsLink />', () => {
  let wrapper: ShallowWrapper;

  afterEach(() => wrapper?.unmount());

  it.each([
    [ undefined, undefined ],
    [ null, null ],
    [ Mock.of<ReachableServer>({ id: '1' }), null ],
    [ Mock.of<ReachableServer>({ id: '1' }), undefined ],
    [ Mock.of<NotFoundServer>(), Mock.all<ShortUrl>() ],
    [ null, Mock.all<ShortUrl>() ],
    [ undefined, Mock.all<ShortUrl>() ],
  ])('only renders a plain span when either server or short URL are not set', (selectedServer, shortUrl) => {
    wrapper = shallow(<VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>Something</VisitStatsLink>);
    const link = wrapper.find(Link);

    expect(link).toHaveLength(0);
    expect(wrapper.html()).toEqual('<span>Something</span>');
  });

  it.each([
    [
      Mock.of<ReachableServer>({ id: '1' }),
      Mock.of<ShortUrl>({ shortCode: 'abc123' }),
      '/server/1/short-code/abc123/visits',
    ],
    [
      Mock.of<ReachableServer>({ id: '3' }),
      Mock.of<ShortUrl>({ shortCode: 'def456', domain: 'example.com' }),
      '/server/3/short-code/def456/visits?domain=example.com',
    ],
  ])('renders link with expected query when', (selectedServer, shortUrl, expectedLink) => {
    wrapper = shallow(<VisitStatsLink selectedServer={selectedServer} shortUrl={shortUrl}>Something</VisitStatsLink>);
    const link = wrapper.find(Link);
    const to = link.prop('to');

    expect(link).toHaveLength(1);
    expect(to).toEqual(expectedLink);
  });
});
