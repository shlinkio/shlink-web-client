import { Mock } from 'ts-mockery';
import { shallow, ShallowWrapper } from 'enzyme';
import { match } from 'react-router';
import { Location, History } from 'history';
import { TagsTable as createTagsTable } from '../../src/tags/TagsTable';
import { SelectedServer } from '../../src/servers/data';
import { TagsList } from '../../src/tags/reducers/tagsList';
import { rangeOf } from '../../src/utils/utils';
import SimplePaginator from '../../src/common/SimplePaginator';
import { NormalizedTag } from '../../src/tags/data';

describe('<TagsTable />', () => {
  const TagsTableRow = () => null;
  const TagsTable = createTagsTable(TagsTableRow);
  const tags = (amount: number) => rangeOf(amount, (i) => `tag_${i}`);
  let wrapper: ShallowWrapper;
  const createWrapper = (filteredTags: string[] = [], search = '') => {
    wrapper = shallow(
      <TagsTable
        tagsList={Mock.of<TagsList>({ stats: {}, filteredTags })}
        selectedServer={Mock.all<SelectedServer>()}
        history={Mock.all<History>()}
        location={Mock.of<Location>({ search })}
        match={Mock.all<match>()}
      />,
    );

    return wrapper;
  };

  beforeEach(() => {
    (global as any).location = { search: '', pathname: '' };
    (global as any).history = { pushState: jest.fn() };
  });

  afterEach(() => wrapper?.unmount());

  it('renders empty result if there are no tags', () => {
    const wrapper = createWrapper();
    const regularRows = wrapper.find('tbody').find('tr');
    const tagRows = wrapper.find(TagsTableRow);

    expect(regularRows).toHaveLength(1);
    expect(tagRows).toHaveLength(0);
  });

  it.each([
    [[ 'foo', 'bar', 'baz' ], 3 ],
    [[ 'foo' ], 1 ],
    [ tags(19), 19 ],
    [ tags(20), 20 ],
    [ tags(30), 20 ],
    [ tags(100), 20 ],
  ])('renders as many rows as there are in current page', (filteredTags, expectedRows) => {
    const wrapper = createWrapper(filteredTags);
    const tagRows = wrapper.find(TagsTableRow);

    expect(tagRows).toHaveLength(expectedRows);
  });

  it.each([
    [[ 'foo', 'bar', 'baz' ], 0 ],
    [[ 'foo' ], 0 ],
    [ tags(19), 0 ],
    [ tags(20), 0 ],
    [ tags(30), 1 ],
    [ tags(100), 1 ],
  ])('renders paginator if there are more than one page', (filteredTags, expectedPaginators) => {
    const wrapper = createWrapper(filteredTags);
    const paginator = wrapper.find(SimplePaginator);

    expect(paginator).toHaveLength(expectedPaginators);
  });

  it.each([
    [ 1, 20, 0 ],
    [ 2, 20, 20 ],
    [ 3, 20, 40 ],
    [ 4, 20, 60 ],
    [ 5, 7, 80 ],
    [ 6, 0, 0 ],
  ])('renders page from query if present', (page, expectedRows, offset) => {
    const wrapper = createWrapper(tags(87), `page=${page}`);
    const tagRows = wrapper.find(TagsTableRow);

    expect(tagRows).toHaveLength(expectedRows);
    tagRows.forEach((row, index) => {
      expect(row.prop('tag')).toEqual(expect.objectContaining({ tag: `tag_${index + offset + 1}` }));
    });
  });

  it('allows changing current page in paginator', () => {
    const wrapper = createWrapper(tags(100));

    expect(wrapper.find(SimplePaginator).prop('currentPage')).toEqual(1);
    (wrapper.find(SimplePaginator).prop('setCurrentPage') as Function)(5);
    expect(wrapper.find(SimplePaginator).prop('currentPage')).toEqual(5);
  });

  it('orders tags when column is clicked', () => {
    const wrapper = createWrapper(tags(100));
    const firstRowText = () => (wrapper.find('tbody').find(TagsTableRow).first().prop('tag') as NormalizedTag).tag;

    expect(firstRowText()).toEqual('tag_1');
    wrapper.find('thead').find('th').first().simulate('click'); // Tag column ASC
    expect(firstRowText()).toEqual('tag_1');
    wrapper.find('thead').find('th').first().simulate('click'); // Tag column DESC
    expect(firstRowText()).toEqual('tag_99');
    wrapper.find('thead').find('th').at(2).simulate('click'); // Visits column - ASC
    expect(firstRowText()).toEqual('tag_100');
    wrapper.find('thead').find('th').at(2).simulate('click'); // Visits column - DESC
    expect(firstRowText()).toEqual('tag_1');
    wrapper.find('thead').find('th').at(2).simulate('click'); // Visits column - reset
    expect(firstRowText()).toEqual('tag_1');
    wrapper.find('thead').find('th').at(1).simulate('click'); // Short URLs column - ASC
    expect(firstRowText()).toEqual('tag_100');
    wrapper.find('thead').find('th').at(1).simulate('click'); // Short URLs column - DESC
    expect(firstRowText()).toEqual('tag_1');
  });
});
