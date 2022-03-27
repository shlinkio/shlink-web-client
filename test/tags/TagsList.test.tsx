import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import createTagsList, { TagsListProps } from '../../src/tags/TagsList';
import Message from '../../src/utils/Message';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';
import { Result } from '../../src/utils/Result';
import { TagsModeDropdown } from '../../src/tags/TagsModeDropdown';
import SearchField from '../../src/utils/SearchField';
import { Settings } from '../../src/settings/reducers/settings';
import { TagsOrderableFields } from '../../src/tags/data/TagsListChildrenProps';
import { OrderingDropdown } from '../../src/utils/OrderingDropdown';

describe('<TagsList />', () => {
  let wrapper: ShallowWrapper;
  const filterTags = jest.fn();
  const TagsCards = () => null;
  const TagsTable = () => null;
  const TagsListComp = createTagsList(TagsCards, TagsTable);
  const createWrapper = (tagsList: Partial<TagsList>) => {
    wrapper = shallow(
      <TagsListComp
        {...Mock.all<TagsListProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: {} })}
        forceListTags={identity}
        filterTags={filterTags}
        tagsList={Mock.of<TagsList>(tagsList)}
        settings={Mock.all<Settings>()}
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('shows a loading message when tags are being loaded', () => {
    const wrapper = createWrapper({ loading: true });
    const loadingMsg = wrapper.find(Message);
    const searchField = wrapper.find(SearchField);

    expect(loadingMsg).toHaveLength(1);
    expect(loadingMsg.html()).toContain('Loading...');
    expect(searchField).toHaveLength(0);
  });

  it('shows an error when tags failed to be loaded', () => {
    const wrapper = createWrapper({ error: true });
    const errorMsg = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');
    const searchField = wrapper.find(SearchField);

    expect(errorMsg).toHaveLength(1);
    expect(errorMsg.html()).toContain('Error loading tags :(');
    expect(searchField).toHaveLength(0);
  });

  it('shows a message when the list of tags is empty', () => {
    const wrapper = createWrapper({ filteredTags: [] });
    const msg = wrapper.find(Message);

    expect(msg).toHaveLength(1);
    expect(msg.html()).toContain('No tags found');
  });

  it('renders proper component based on the display mode', () => {
    const wrapper = createWrapper({ filteredTags: ['foo', 'bar'], stats: {} });

    expect(wrapper.find(TagsCards)).toHaveLength(1);
    expect(wrapper.find(TagsTable)).toHaveLength(0);

    wrapper.find(TagsModeDropdown).simulate('change');

    expect(wrapper.find(TagsCards)).toHaveLength(0);
    expect(wrapper.find(TagsTable)).toHaveLength(1);
  });

  it('triggers tags filtering when search field changes', () => {
    const wrapper = createWrapper({ filteredTags: [] });
    const searchField = wrapper.find(SearchField);

    expect(searchField).toHaveLength(1);
    expect(filterTags).not.toHaveBeenCalled();
    searchField.simulate('change');
    expect(filterTags).toHaveBeenCalledTimes(1);
  });

  it('triggers ordering when sorting dropdown changes', () => {
    const wrapper = createWrapper({ filteredTags: [] });

    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({});
    wrapper.find(OrderingDropdown).simulate('change', 'tag', 'DESC');
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'tag', dir: 'DESC' });
    wrapper.find(OrderingDropdown).simulate('change', 'visits', 'ASC');
    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({ field: 'visits', dir: 'ASC' });
  });

  it('can update current order via orderByColumn from table component', () => {
    const wrapper = createWrapper({ filteredTags: ['foo', 'bar'], stats: {} });
    const callOrderBy = (field: TagsOrderableFields) => {
      ((wrapper.find(TagsTable).prop('orderByColumn') as Function)(field) as Function)();
    };

    wrapper.find(TagsModeDropdown).simulate('change'); // Make sure table is rendered

    callOrderBy('visits');
    expect(wrapper.find(TagsTable).prop('currentOrder')).toEqual({ field: 'visits', dir: 'ASC' });
    callOrderBy('visits');
    expect(wrapper.find(TagsTable).prop('currentOrder')).toEqual({ field: 'visits', dir: 'DESC' });
    callOrderBy('tag');
    expect(wrapper.find(TagsTable).prop('currentOrder')).toEqual({ field: 'tag', dir: 'ASC' });
    callOrderBy('shortUrls');
    expect(wrapper.find(TagsTable).prop('currentOrder')).toEqual({ field: 'shortUrls', dir: 'ASC' });
  });
});
