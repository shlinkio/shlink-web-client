import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ShortUrlsList as ShortUrlsListState } from '../../src/short-urls/reducers/shortUrlsList';
import { Overview as overviewCreator } from '../../src/servers/Overview';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { VisitsOverview } from '../../src/visits/reducers/visitsOverview';
import { MercureInfo } from '../../src/mercure/reducers/mercureInfo';
import { ReachableServer } from '../../src/servers/data';
import { prettify } from '../../src/utils/helpers/numbers';

describe('<Overview />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsTable = () => null;
  const CreateShortUrl = () => null;
  const listShortUrls = jest.fn();
  const listTags = jest.fn();
  const loadVisitsOverview = jest.fn();
  const Overview = overviewCreator(ShortUrlsTable, CreateShortUrl);
  const shortUrls = {
    pagination: { totalItems: 83710 },
  };
  const serverId = '123';
  const createWrapper = (loading = false) => {
    wrapper = shallow(
      <Overview
        listShortUrls={listShortUrls}
        listTags={listTags}
        loadVisitsOverview={loadVisitsOverview}
        shortUrlsList={Mock.of<ShortUrlsListState>({ loading, shortUrls })}
        tagsList={Mock.of<TagsList>({ loading, tags: [ 'foo', 'bar', 'baz' ] })}
        visitsOverview={Mock.of<VisitsOverview>({ loading, visitsCount: 3456 })}
        selectedServer={Mock.of<ReachableServer>({ id: serverId })}
        createNewVisits={jest.fn()}
        loadMercureInfo={jest.fn()}
        mercureInfo={Mock.all<MercureInfo>()}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  test('cards display loading messages when still loading', () => {
    const wrapper = createWrapper(true);
    const cards = wrapper.find(CardText);

    expect(cards).toHaveLength(3);
    cards.forEach((card) => expect(card.html()).toContain('Loading...'));
  });

  test('amounts are displayed in cards after finishing loading', () => {
    const wrapper = createWrapper();
    const cards = wrapper.find(CardText);

    expect(cards).toHaveLength(3);
    expect(cards.at(0).html()).toContain(prettify(3456));
    expect(cards.at(1).html()).toContain(prettify(83710));
    expect(cards.at(2).html()).toContain(prettify(3));
  });

  test('nests complex components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(CreateShortUrl)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsTable)).toHaveLength(1);
  });

  test('links to other sections are displayed', () => {
    const wrapper = createWrapper();
    const links = wrapper.find(Link);

    expect(links).toHaveLength(2);
    expect(links.at(0).prop('to')).toEqual(`/server/${serverId}/create-short-url`);
    expect(links.at(1).prop('to')).toEqual(`/server/${serverId}/list-short-urls/1`);
  });
});
