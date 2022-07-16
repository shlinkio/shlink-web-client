import { screen } from '@testing-library/react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { DropdownItem } from 'reactstrap';
import { MemoryRouter } from 'react-router-dom';
import { TagsTableRow as createTagsTableRow } from '../../src/tags/TagsTableRow';
import { ReachableServer } from '../../src/servers/data';
import { DropdownBtnMenu } from '../../src/utils/DropdownBtnMenu';
import { renderWithEvents } from '../__helpers__/setUpTest';
import { colorGeneratorMock } from '../utils/services/__mocks__/ColorGenerator.mock';

describe('<TagsTableRow />', () => {
  const DeleteTagConfirmModal = () => null;
  const EditTagModal = () => null;
  const TagsTableRow = createTagsTableRow(DeleteTagConfirmModal, EditTagModal, colorGeneratorMock);
  const setUp = (tagStats?: { visits?: number; shortUrls?: number }) => renderWithEvents(
    <MemoryRouter>
      <table>
        <tbody>
          <TagsTableRow
            tag={{ tag: 'foo&bar', visits: tagStats?.visits ?? 0, shortUrls: tagStats?.shortUrls ?? 0 }}
            selectedServer={Mock.of<ReachableServer>({ id: 'abc123' })}
          />
        </tbody>
      </table>
    </MemoryRouter>,
  );

  let wrapper: ShallowWrapper;
  const createWrapper = (tagStats?: { visits?: number; shortUrls?: number }) => {
    wrapper = shallow(
      <TagsTableRow
        tag={{ tag: 'foo&bar', visits: tagStats?.visits ?? 0, shortUrls: tagStats?.shortUrls ?? 0 }}
        selectedServer={Mock.of<ReachableServer>({ id: 'abc123' })}
      />,
    );

    return wrapper;
  };
  afterEach(() => wrapper?.unmount());

  it.each([
    [undefined, '0', '0'],
    [{ shortUrls: 10, visits: 3480 }, '10', '3,480'],
  ])('shows expected tag stats', (stats, expectedShortUrls, expectedVisits) => {
    setUp(stats);

    const [shortUrlsLink, visitsLink] = screen.getAllByRole('link');

    expect(shortUrlsLink).toHaveTextContent(expectedShortUrls);
    expect(shortUrlsLink).toHaveAttribute(
      'href',
      `/server/abc123/list-short-urls/1?tags=${encodeURIComponent('foo&bar')}`,
    );
    expect(visitsLink).toHaveTextContent(expectedVisits);
    expect(visitsLink).toHaveAttribute('href', '/server/abc123/tag/foo&bar/visits');
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
