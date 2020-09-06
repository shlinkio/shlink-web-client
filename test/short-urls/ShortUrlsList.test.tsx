import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import { Mock } from 'ts-mockery';
import shortUrlsListCreator, { ShortUrlsListProps, SORTABLE_FIELDS } from '../../src/short-urls/ShortUrlsList';
import { ShortUrl } from '../../src/short-urls/data';
import { MercureBoundProps } from '../../src/mercure/helpers/boundToMercureHub';

describe('<ShortUrlsList />', () => {
  let wrapper: ShallowWrapper;
  const ShortUrlsRow = () => null;
  const listShortUrlsMock = jest.fn();
  const resetShortUrlParamsMock = jest.fn();

  const ShortUrlsList = shortUrlsListCreator(ShortUrlsRow);

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlsList
        {...Mock.all<ShortUrlsListProps>()}
        {...Mock.of<MercureBoundProps>({ mercureInfo: { loading: true } })}
        listShortUrls={listShortUrlsMock}
        resetShortUrlParams={resetShortUrlParamsMock}
        shortUrlsListParams={{
          page: '1',
          tags: [ 'test tag' ],
          searchTerm: 'example.com',
        }}
        match={{ params: {} } as any}
        location={{} as any}
        loading={false}
        error={false}
        shortUrlsList={
          [
            Mock.of<ShortUrl>({
              shortCode: 'testShortCode',
              shortUrl: 'https://www.example.com/testShortUrl',
              longUrl: 'https://www.example.com/testLongUrl',
              tags: [ 'test tag' ],
            }),
          ]
        }
      />,
    ).dive(); // Dive is needed as this component is wrapped in a HOC
  });

  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('wraps a ShortUrlsList with 1 ShortUrlsRow', () => {
    expect(wrapper.find(ShortUrlsRow)).toHaveLength(1);
  });

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

    Object.keys(SORTABLE_FIELDS).forEach((sortableField) => {
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(0);

      getThElementForSortableField(sortableField).simulate('click');
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(1);
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon).prop('icon')).toEqual(caretUpIcon);

      getThElementForSortableField(sortableField).simulate('click');
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(1);
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon).prop('icon')).toEqual(caretDownIcon);

      getThElementForSortableField(sortableField).simulate('click');
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(0);
    });
  });
});
