import React from 'react';
import { shallow } from 'enzyme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown as caretDownIcon, faCaretUp as caretUpIcon } from '@fortawesome/free-solid-svg-icons';
import shortUrlsListCreator, { SORTABLE_FIELDS } from '../../src/short-urls/ShortUrlsList';

describe('<ShortUrlsList />', () => {
  let wrapper;
  const ShortUrlsRow = () => '';
  const listShortUrlsMock = jest.fn();
  const resetShortUrlParamsMock = jest.fn();

  const ShortUrlsList = shortUrlsListCreator(ShortUrlsRow);

  beforeEach(() => {
    wrapper = shallow(
      <ShortUrlsList
        listShortUrls={listShortUrlsMock}
        resetShortUrlParams={resetShortUrlParamsMock}
        shortUrlsListParams={{
          page: '1',
          tags: [ 'test tag' ],
          searchTerm: 'example.com',
        }}
        match={{ params: {} }}
        location={{}}
        loading={false}
        error={false}
        shortUrlsList={
          [
            {
              shortCode: 'testShortCode',
              shortUrl: 'https://www.example.com/testShortUrl',
              longUrl: 'https://www.example.com/testLongUrl',
              tags: [ 'test tag' ],
            },
          ]
        }
        mercureInfo={{ loading: true }}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    wrapper && wrapper.unmount();
  });

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
    const orderDirOptionToIconMap = {
      ASC: caretUpIcon,
      DESC: caretDownIcon,
    };
    const getThElementForSortableField = (sortableField) => wrapper.find('table')
      .find('thead')
      .find('tr')
      .find('th')
      .filterWhere((e) => e.text().includes(SORTABLE_FIELDS[sortableField]));

    Object.keys(SORTABLE_FIELDS).forEach((sortableField) => {
      const sortableThElementWrapper = getThElementForSortableField(sortableField);

      expect(sortableThElementWrapper.find(FontAwesomeIcon)).toHaveLength(0);

      sortableThElementWrapper.simulate('click');
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(1);
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon).prop('icon')).toEqual(
        orderDirOptionToIconMap.ASC,
      );

      sortableThElementWrapper.simulate('click');
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon)).toHaveLength(1);
      expect(getThElementForSortableField(sortableField).find(FontAwesomeIcon).prop('icon')).toEqual(
        orderDirOptionToIconMap.DESC,
      );

      sortableThElementWrapper.simulate('click');
      expect(sortableThElementWrapper.find(FontAwesomeIcon)).toHaveLength(0);
    });
  });
});
