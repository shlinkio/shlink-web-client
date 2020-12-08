import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShortUrlsTable as shortUrlsTableCreator } from '../../src/short-urls/ShortUrlsTable';
import { SORTABLE_FIELDS } from '../../src/short-urls/reducers/shortUrlsListParams';
import { ShortUrlsList } from '../../src/short-urls/reducers/shortUrlsList';

describe('<ShortUrlsTable />', () => {
  let wrapper: ShallowWrapper;
  const shortUrlsList = Mock.all<ShortUrlsList>();
  const orderByColumn = jest.fn();
  const ShortUrlsRow = () => null;

  const ShortUrlsTable = shortUrlsTableCreator(ShortUrlsRow);

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlsTable shortUrlsList={shortUrlsList} selectedServer={null} orderByColumn={() => orderByColumn} />,
    );
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('should render inner table by default', () => {
    expect(wrapper.find('table')).toHaveLength(1);
  });

  it('should render table header by default', () => {
    expect(wrapper.find('table').find('thead')).toHaveLength(1);
  });

  it('should render 6 table header cells by default', () => {
    expect(wrapper.find('table').find('thead').find('tr').find('th')).toHaveLength(6);
  });

  it('should render 6 table header cells without order by icon by default', () => {
    const thElements = wrapper.find('table').find('thead').find('tr').find('th');

    thElements.forEach((thElement) => {
      expect(thElement.find(FontAwesomeIcon)).toHaveLength(0);
    });
  });

  it('should render 6 table header cells with conditional order by icon', () => {
    const getThElementForSortableField = (sortableField: string) => wrapper.find('table')
      .find('thead')
      .find('tr')
      .find('th')
      .filterWhere((e) => e.text().includes(SORTABLE_FIELDS[sortableField as keyof typeof SORTABLE_FIELDS]));
    const sortableFields = Object.keys(SORTABLE_FIELDS);

    expect.assertions(sortableFields.length);
    sortableFields.forEach((sortableField) => {
      getThElementForSortableField(sortableField).simulate('click');
      expect(orderByColumn).toHaveBeenCalled();
    });
  });
});
