import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { Link } from 'react-router-dom';
import { DropdownItem } from 'reactstrap';
import { TagsTableRow as createTagsTableRow } from '../../src/tags/TagsTableRow';
import { ReachableServer } from '../../src/servers/data';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { TagStats } from '../../src/tags/data';
import { DropdownBtnMenu } from '../../src/utils/DropdownBtnMenu';

describe('<TagsTableRow />', () => {
  const DeleteTagConfirmModal = () => null;
  const EditTagModal = () => null;
  const TagsTableRow = createTagsTableRow(DeleteTagConfirmModal, EditTagModal);
  let wrapper: ShallowWrapper;
  const createWrapper = (tagStats?: TagStats) => {
    wrapper = shallow(
      <TagsTableRow
        tag="foo&bar"
        tagStats={tagStats}
        selectedServer={Mock.of<ReachableServer>({ id: 'abc123' })}
        colorGenerator={Mock.all<ColorGenerator>()}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [ undefined, '0', '0' ],
    [ Mock.of<TagStats>({ shortUrlsCount: 10, visitsCount: 3480 }), '10', '3,480' ],
  ])('shows expected tag stats', (stats, expectedShortUrls, expectedVisits) => {
    const wrapper = createWrapper(stats);
    const links = wrapper.find(Link);
    const shortUrlsLink = links.first();
    const visitsLink = links.last();

    expect(shortUrlsLink.prop('children')).toEqual(expectedShortUrls);
    expect(shortUrlsLink.prop('to')).toEqual(`/server/abc123/list-short-urls/1?tag=${encodeURIComponent('foo&bar')}`);
    expect(visitsLink.prop('children')).toEqual(expectedVisits);
    expect(visitsLink.prop('to')).toEqual('/server/abc123/tag/foo&bar/visits');
  });

  it('allows toggling dropdown menu', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(DropdownBtnMenu).prop('isOpen')).toEqual(false);
    (wrapper.find(DropdownBtnMenu).prop('toggle') as Function)();
    expect(wrapper.find(DropdownBtnMenu).prop('isOpen')).toEqual(true);
  });

  it('allows toggling modals through dropdown items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);

    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(false);
    items.first().simulate('click');
    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(true);

    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(false);
    items.last().simulate('click');
    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(true);
  });

  it('allows toggling modals through the modals themselves', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(false);
    (wrapper.find(EditTagModal).prop('toggle') as Function)();
    expect(wrapper.find(EditTagModal).prop('isOpen')).toEqual(true);

    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(false);
    (wrapper.find(DeleteTagConfirmModal).prop('toggle') as Function)();
    expect(wrapper.find(DeleteTagConfirmModal).prop('isOpen')).toEqual(true);
  });
});
