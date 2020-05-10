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
  const DeleteTagConfirmModal = jest.fn();
  const EditTagModal = jest.fn();

  beforeEach(() => {
    const TagCard = createTagCard(DeleteTagConfirmModal, EditTagModal, () => '', {});

    wrapper = shallow(<TagCard tag="ssr" selectedServer={{ id: 1, serverNotFound: false }} tagStats={tagStats} />);
  });

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it('shows a TagBullet and a link to the list filtering by the tag', () => {
    const links = wrapper.find(Link);
    const bullet = wrapper.find(TagBullet);

    expect(links.at(0).prop('to')).toEqual('/server/1/list-short-urls/1?tag=ssr');
    expect(bullet.prop('tag')).toEqual('ssr');
  });

  it('displays delete modal when delete btn is clicked', () => {
    const delBtn = wrapper.find('.tag-card__btn').at(0);

    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(false);
    delBtn.simulate('click');
    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(true);
  });

  it('displays edit modal when edit btn is clicked', () => {
    const editBtn = wrapper.find('.tag-card__btn').at(1);

    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(false);
    editBtn.simulate('click');
    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(true);
  });

  it('shows expected tag stats', () => {
    const links = wrapper.find(Link);

    expect(links.at(1).prop('to')).toEqual('/server/1/list-short-urls/1?tag=ssr');
    expect(links.at(1).text()).toContain('48');
    expect(links.at(2).prop('to')).toEqual('/server/1/tags/ssr/visits');
    expect(links.at(2).text()).toContain('23,257');
  });
});
