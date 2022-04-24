import { FC, PropsWithChildren } from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Link, MemoryRouter } from 'react-router-dom';
import { ShortUrlsList as ShortUrlsListState } from '../../src/short-urls/reducers/shortUrlsList';
import { Overview as overviewCreator } from '../../src/servers/Overview';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { VisitsOverview } from '../../src/visits/reducers/visitsOverview';
import { MercureInfo } from '../../src/mercure/reducers/mercureInfo';
import { ReachableServer } from '../../src/servers/data';
import { prettify } from '../../src/utils/helpers/numbers';
import { HighlightCard } from '../../src/servers/helpers/HighlightCard';

describe('<Overview />', () => {
  let wrapper: ReactWrapper;
  const ShortUrlsTable = () => null;
  const CreateShortUrl = () => null;
  const ForServerVersion: FC<PropsWithChildren<unknown>> = ({ children }) => <>{children}</>;
  const listShortUrls = jest.fn();
  const listTags = jest.fn();
  const loadVisitsOverview = jest.fn();
  const Overview = overviewCreator(ShortUrlsTable, CreateShortUrl, ForServerVersion);
  const shortUrls = {
    pagination: { totalItems: 83710 },
  };
  const serverId = '123';
  const createWrapper = (loading = false) => {
    wrapper = mount(
      <MemoryRouter>
        <Overview
          listShortUrls={listShortUrls}
          listTags={listTags}
          loadVisitsOverview={loadVisitsOverview}
          shortUrlsList={Mock.of<ShortUrlsListState>({ loading, shortUrls })}
          tagsList={Mock.of<TagsList>({ loading, tags: ['foo', 'bar', 'baz'] })}
          visitsOverview={Mock.of<VisitsOverview>({ loading, visitsCount: 3456, orphanVisitsCount: 28 })}
          selectedServer={Mock.of<ReachableServer>({ id: serverId })}
          createNewVisits={jest.fn()}
          loadMercureInfo={jest.fn()}
          mercureInfo={Mock.all<MercureInfo>()}
        />
      </MemoryRouter>,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('displays loading messages when still loading', () => {
    const wrapper = createWrapper(true);
    const cards = wrapper.find(HighlightCard);

    expect(cards).toHaveLength(4);
    cards.forEach((card) => expect(card.html()).toContain('Loading...'));
  });

  it('displays amounts in cards after finishing loading', () => {
    const wrapper = createWrapper();
    const cards = wrapper.find(HighlightCard);

    expect(cards).toHaveLength(4);
    expect(cards.at(0).html()).toContain(prettify(3456));
    expect(cards.at(1).html()).toContain(prettify(28));
    expect(cards.at(2).html()).toContain(prettify(83710));
    expect(cards.at(3).html()).toContain(prettify(3));
  });

  it('nests complex components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(CreateShortUrl)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsTable)).toHaveLength(1);
  });

  it('displays links to other sections', () => {
    const wrapper = createWrapper();
    const links = wrapper.find(Link);

    expect(links).toHaveLength(4);
    expect(links.at(0).prop('to')).toEqual(`/server/${serverId}/list-short-urls/1`);
    expect(links.at(1).prop('to')).toEqual(`/server/${serverId}/manage-tags`);
    expect(links.at(2).prop('to')).toEqual(`/server/${serverId}/create-short-url`);
    expect(links.at(3).prop('to')).toEqual(`/server/${serverId}/list-short-urls/1`);
  });
});
