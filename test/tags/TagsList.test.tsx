import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import createTagsList, { TagsListProps } from '../../src/tags/TagsList';
import Message from '../../src/utils/Message';
import SearchField from '../../src/utils/SearchField';
import { rangeOf } from '../../src/utils/utils';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';

describe('<TagsList />', () => {
  let wrapper: ShallowWrapper;
  const filterTags = jest.fn();
  const TagCard = () => null;
  const createWrapper = (tagsList: Partial<TagsList>) => {
    const TagsListComp = createTagsList(TagCard);

    wrapper = shallow(
      <TagsListComp
        {...Mock.all<TagsListProps>()}
        {...Mock.all<MercureBoundProps>()}
        forceListTags={identity}
        filterTags={filterTags}
        tagsList={Mock.of<TagsList>(tagsList)}
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
    const errorMsg = wrapper.find('.bg-danger');

    expect(errorMsg).toHaveLength(1);
    expect(errorMsg.html()).toContain('Error loading tags :(');
  });

  it('shows a message when the list of tags is empty', () => {
    const wrapper = createWrapper({ filteredTags: [] });
    const msg = wrapper.find(Message);

    expect(msg).toHaveLength(1);
    expect(msg.html()).toContain('No tags found');
  });

  it('renders the proper amount of groups and cards based on the amount of tags', () => {
    const amountOfTags = 10;
    const amountOfGroups = 4;
    const wrapper = createWrapper({ filteredTags: rangeOf(amountOfTags, (i) => `tag_${i}`), stats: {} });
    const cards = wrapper.find(TagCard);
    const groups = wrapper.find('.col-md-6');

    expect(cards).toHaveLength(amountOfTags);
    expect(groups).toHaveLength(amountOfGroups);
  });

  it('triggers tags filtering when search field changes', (done) => {
    const wrapper = createWrapper({ filteredTags: [] });
    const searchField = wrapper.find(SearchField);

    expect(searchField).toHaveLength(1);
    expect(filterTags).not.toHaveBeenCalled();
    searchField.simulate('change');

    setImmediate(() => {
      expect(filterTags).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
