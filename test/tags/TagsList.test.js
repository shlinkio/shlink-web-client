import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import * as sinon from 'sinon';
import createTagsList from '../../src/tags/TagsList';
import MuttedMessage from '../../src/utils/MuttedMessage';
import SearchField from '../../src/utils/SearchField';
import { rangeOf } from '../../src/utils/utils';

describe('<TagsList />', () => {
  let wrapper;
  const filterTags = sinon.spy();
  const TagCard = () => '';
  const createWrapper = (tagsList) => {
    const params = { serverId: '1' };
    const TagsList = createTagsList(TagCard);

    wrapper = shallow(
      <TagsList forceListTags={identity} filterTags={filterTags} match={{ params }} tagsList={tagsList} />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    filterTags.resetHistory();
  });

  it('shows a loading message when tags are being loaded', () => {
    const wrapper = createWrapper({ loading: true });
    const loadingMsg = wrapper.find(MuttedMessage);

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
    const msg = wrapper.find(MuttedMessage);

    expect(msg).toHaveLength(1);
    expect(msg.html()).toContain('No tags found');
  });

  it('renders the proper amount of groups and cards based on the amount of tags', () => {
    const amountOfTags = 10;
    const amountOfGroups = 4;
    const wrapper = createWrapper({ filteredTags: rangeOf(amountOfTags, (i) => `tag_${i}`) });
    const cards = wrapper.find(TagCard);
    const groups = wrapper.find('.col-md-6');

    expect(cards).toHaveLength(amountOfTags);
    expect(groups).toHaveLength(amountOfGroups);
  });

  it('triggers tags filtering when search field changes', (done) => {
    const wrapper = createWrapper({ filteredTags: [] });
    const searchField = wrapper.find(SearchField);

    expect(searchField).toHaveLength(1);
    expect(filterTags.callCount).toEqual(0);
    searchField.simulate('change');

    setImmediate(() => {
      expect(filterTags.callCount).toEqual(1);
      done();
    });
  });
});
