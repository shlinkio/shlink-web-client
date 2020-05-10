import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import createTagCard from '../../src/tags/TagCard';
import TagBullet from '../../src/tags/helpers/TagBullet';

describe('<TagCard />', () => {
  let wrapper;
  const tagStats = {
    shortUrlsCount: 48,
    visitsCount: 23257,
  };

  beforeEach(() => {
    const TagCard = createTagCard(() => '', () => '', () => '', {});

    wrapper = shallow(<TagCard tag="ssr" selectedServer={{ id: 1, serverNotFound: false }} tagStats={tagStats} />);
  });
  afterEach(() => wrapper.unmount());

  it('shows a TagBullet and a link to the list filtering by the tag', () => {
    const links = wrapper.find(Link);
    const bullet = wrapper.find(TagBullet);

    expect(links.at(0).prop('to')).toEqual('/server/1/list-short-urls/1?tag=ssr');
    expect(bullet.prop('tag')).toEqual('ssr');
  });

  it('displays delete modal when delete btn is clicked', (done) => {
    const delBtn = wrapper.find('.tag-card__btn').at(0);

    expect(wrapper.state('isDeleteModalOpen')).toEqual(false);
    delBtn.simulate('click');

    setImmediate(() => {
      expect(wrapper.state('isDeleteModalOpen')).toEqual(true);
      done();
    });
  });

  it('displays edit modal when edit btn is clicked', (done) => {
    const editBtn = wrapper.find('.tag-card__btn').at(1);

    expect(wrapper.state('isEditModalOpen')).toEqual(false);
    editBtn.simulate('click');

    setImmediate(() => {
      expect(wrapper.state('isEditModalOpen')).toEqual(true);
      done();
    });
  });

  it('shows expected tag stats', () => {
    const links = wrapper.find(Link);

    expect(links.at(1).prop('to')).toEqual('/server/1/list-short-urls/1?tag=ssr');
    expect(links.at(1).text()).toContain('48');
    expect(links.at(2).prop('to')).toEqual('/server/1/tags/ssr/visits');
    expect(links.at(2).text()).toContain('23,257');
  });
});
