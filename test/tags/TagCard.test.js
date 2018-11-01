import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import TagCard from '../../src/tags/TagCard';
import TagBullet from '../../src/tags/helpers/TagBullet';

describe('<TagCard />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<TagCard tag="ssr" currentServerId="1" />);
  });
  afterEach(() => wrapper.unmount());

  it('shows a TagBullet and a link to the list filtering by the tag', () => {
    const link = wrapper.find(Link);
    const bullet = wrapper.find(TagBullet);

    expect(link.prop('to')).toEqual('/server/1/list-short-urls/1?tag=ssr');
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
});
