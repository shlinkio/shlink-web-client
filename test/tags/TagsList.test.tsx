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

    expect(loadingMsg).toHaveLength(1);
    expect(loadingMsg.html()).toContain('Loading...');
  });

  it('shows an error when tags failed to be loaded', () => {
    const wrapper = createWrapper({ error: true });
    const errorMsg = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');

    expect(errorMsg).toHaveLength(1);
    expect(errorMsg.html()).toContain('Error loading tags :(');
  });

  it('shows a message when the list of tags is empty', () => {
    const wrapper = createWrapper({ filteredTags: [] });
    const msg = wrapper.find(Message);

    expect(msg).toHaveLength(1);
    expect(msg.html()).toContain('No tags found');
  });

  it('renders proper component based on the display mode', () => {
    const wrapper = createWrapper({ filteredTags: [ 'foo', 'bar' ], stats: {} });

    expect(wrapper.find(TagsCards)).toHaveLength(1);
    expect(wrapper.find(TagsTable)).toHaveLength(0);

    wrapper.find(TagsModeDropdown).simulate('change');

    expect(wrapper.find(TagsCards)).toHaveLength(0);
    expect(wrapper.find(TagsTable)).toHaveLength(1);
  });

  it('triggers tags filtering when search field changes', () => {
    const wrapper = createWrapper({ filteredTags: [] });

    expect(filterTags).not.toHaveBeenCalled();
    wrapper.find(SearchField).simulate('change');
    expect(filterTags).toHaveBeenCalledTimes(1);
  });
});
