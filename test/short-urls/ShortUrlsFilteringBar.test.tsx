import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { formatISO } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import filteringBarCreator from '../../src/short-urls/ShortUrlsFilteringBar';
import SearchField from '../../src/utils/SearchField';
import Tag from '../../src/tags/helpers/Tag';
import { DateRangeSelector } from '../../src/utils/dates/DateRangeSelector';
import ColorGenerator from '../../src/utils/services/ColorGenerator';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { TooltipToggleSwitch } from '../../src/utils/TooltipToggleSwitch';
import { OrderingDropdown } from '../../src/utils/OrderingDropdown';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn().mockReturnValue({ serverId: '1' }),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<ShortUrlsFilteringBar />', () => {
  let wrapper: ShallowWrapper;
  const ExportShortUrlsBtn = () => null;
  const ShortUrlsFilteringBar = filteringBarCreator(Mock.all<ColorGenerator>(), ExportShortUrlsBtn);
  const navigate = jest.fn();
  const handleOrderBy = jest.fn();
  const now = new Date();
  const createWrapper = (search = '', selectedServer?: SelectedServer) => {
    (useLocation as any).mockReturnValue({ search });
    (useNavigate as any).mockReturnValue(navigate);

    wrapper = shallow(
      <ShortUrlsFilteringBar
        selectedServer={selectedServer ?? Mock.all<SelectedServer>()}
        order={{}}
        handleOrderBy={handleOrderBy}
      />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders expected children components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(SearchField)).toHaveLength(1);
    expect(wrapper.find(DateRangeSelector)).toHaveLength(1);
    expect(wrapper.find(OrderingDropdown)).toHaveLength(1);
    expect(wrapper.find(ExportShortUrlsBtn)).toHaveLength(1);
  });

  it.each([
    ['tags=foo,bar,baz', 3],
    ['tags=foo,baz', 2],
    ['', 0],
    ['foo=bar', 0],
  ])('renders the proper amount of tags', (search, expectedTagComps) => {
    const wrapper = createWrapper(search);

    expect(wrapper.find(Tag)).toHaveLength(expectedTagComps);
  });

  it('redirects to first page when search field changes', () => {
    const wrapper = createWrapper();
    const searchField = wrapper.find(SearchField);

    expect(navigate).not.toHaveBeenCalled();
    searchField.simulate('change', 'search-term');
    expect(navigate).toHaveBeenCalledWith('/server/1/list-short-urls/1?search=search-term');
  });

  it('redirects to first page when a tag is removed', () => {
    const wrapper = createWrapper('tags=foo,bar');
    const tag = wrapper.find(Tag).first();

    expect(navigate).not.toHaveBeenCalled();
    tag.simulate('close');
    expect(navigate).toHaveBeenCalledWith('/server/1/list-short-urls/1?tags=bar');
  });

  it.each([
    [{ startDate: now }, `startDate=${encodeURIComponent(formatISO(now))}`],
    [{ endDate: now }, `endDate=${encodeURIComponent(formatISO(now))}`],
    [
      { startDate: now, endDate: now },
      `startDate=${encodeURIComponent(formatISO(now))}&endDate=${encodeURIComponent(formatISO(now))}`,
    ],
  ])('redirects to first page when date range changes', (dates, expectedQuery) => {
    const wrapper = createWrapper();
    const dateRange = wrapper.find(DateRangeSelector);

    expect(navigate).not.toHaveBeenCalled();
    dateRange.simulate('datesChange', dates);
    expect(navigate).toHaveBeenCalledWith(`/server/1/list-short-urls/1?${expectedQuery}`);
  });

  it.each([
    ['tags=foo,bar,baz', Mock.of<ReachableServer>({ version: '3.0.0' }), 1],
    ['tags=foo,bar', Mock.of<ReachableServer>({ version: '3.1.0' }), 1],
    ['tags=foo', Mock.of<ReachableServer>({ version: '3.0.0' }), 0],
    ['', Mock.of<ReachableServer>({ version: '3.0.0' }), 0],
    ['tags=foo,bar,baz', Mock.of<ReachableServer>({ version: '2.10.0' }), 0],
    ['', Mock.of<ReachableServer>({ version: '2.10.0' }), 0],
  ])(
    'renders tags mode toggle if the server supports it and there is more than one tag selected',
    (search, selectedServer, expectedTagToggleComponents) => {
      const wrapper = createWrapper(search, selectedServer);
      const toggle = wrapper.find(TooltipToggleSwitch);

      expect(toggle).toHaveLength(expectedTagToggleComponents);
    },
  );

  it.each([
    ['', 'Short URLs including any tag.', false],
    ['&tagsMode=all', 'Short URLs including all tags.', true],
    ['&tagsMode=any', 'Short URLs including any tag.', false],
  ])('expected tags mode tooltip title', (initialTagsMode, expectedToggleText, expectedChecked) => {
    const wrapper = createWrapper(`tags=foo,bar${initialTagsMode}`, Mock.of<ReachableServer>({ version: '3.0.0' }));
    const toggle = wrapper.find(TooltipToggleSwitch);

    expect(toggle.prop('children')).toEqual(expectedToggleText);
    expect(toggle.prop('checked')).toEqual(expectedChecked);
  });

  it.each([
    ['', 'tagsMode=all'],
    ['&tagsMode=all', 'tagsMode=any'],
    ['&tagsMode=any', 'tagsMode=all'],
  ])('redirects to first page when tags mode changes', (initialTagsMode, expectedRedirectTagsMode) => {
    const wrapper = createWrapper(`tags=foo,bar${initialTagsMode}`, Mock.of<ReachableServer>({ version: '3.0.0' }));
    const toggle = wrapper.find(TooltipToggleSwitch);

    expect(navigate).not.toHaveBeenCalled();
    toggle.simulate('change');
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining(expectedRedirectTagsMode));
  });

  it('handles order through dropdown', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(OrderingDropdown).prop('order')).toEqual({});

    wrapper.find(OrderingDropdown).simulate('change', 'visits', 'ASC');
    expect(handleOrderBy).toHaveBeenCalledWith('visits', 'ASC');

    wrapper.find(OrderingDropdown).simulate('change', 'shortCode', 'DESC');
    expect(handleOrderBy).toHaveBeenCalledWith('shortCode', 'DESC');

    wrapper.find(OrderingDropdown).simulate('change', undefined, undefined);
    expect(handleOrderBy).toHaveBeenCalledWith(undefined, undefined);
  });
});
