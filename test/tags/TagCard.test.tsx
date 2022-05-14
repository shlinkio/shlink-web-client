import { shallow, ShallowWrapper } from 'enzyme';
import { Link } from 'react-router-dom';
import { Mock } from 'ts-mockery';
import createTagCard from '../../src/tags/TagCard';
import TagBullet from '../../src/tags/helpers/TagBullet';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { ReachableServer } from '../../src/servers/data';

describe('<TagCard />', () => {
  let wrapper: ShallowWrapper;
  const DeleteTagConfirmModal = jest.fn();
  const EditTagModal = jest.fn();
  const TagCard = createTagCard(DeleteTagConfirmModal, EditTagModal, Mock.all<ColorGenerator>());
  const createWrapper = (tag = 'ssr') => {
    wrapper = shallow(
      <TagCard
        tag={{ tag, visits: 23257, shortUrls: 48 }}
        selectedServer={Mock.of<ReachableServer>({ id: '1' })}
        displayed
        toggle={() => {}}
      />,
    );

    return wrapper;
  };

  beforeEach(() => createWrapper());

  afterEach(() => wrapper.unmount());
  afterEach(jest.resetAllMocks);

  it.each([
    ['ssr', '/server/1/list-short-urls/1?tags=ssr'],
    ['ssr-&-foo', '/server/1/list-short-urls/1?tags=ssr-%26-foo'],
  ])('shows a TagBullet and a link to the list filtering by the tag', (tag, expectedLink) => {
    const wrapper = createWrapper(tag);
    const links = wrapper.find(Link);
    const bullet = wrapper.find(TagBullet);

    expect(links.at(0).prop('to')).toEqual(expectedLink);
    expect(bullet.prop('tag')).toEqual(tag);
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

    expect(links).toHaveLength(2);
    expect(links.at(0).prop('to')).toEqual('/server/1/list-short-urls/1?tags=ssr');
    expect(links.at(0).text()).toContain('48');
    expect(links.at(1).prop('to')).toEqual('/server/1/tag/ssr/visits');
    expect(links.at(1).text()).toContain('23,257');
  });
});
