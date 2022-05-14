import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import {
  DEFAULT_SHORT_URLS_ORDERING,
  Settings,
  ShortUrlsListSettings as ShortUrlsSettings,
} from '../../src/settings/reducers/settings';
import { ShortUrlsListSettings } from '../../src/settings/ShortUrlsListSettings';
import { OrderingDropdown } from '../../src/utils/OrderingDropdown';
import { ShortUrlsOrder } from '../../src/short-urls/data';

describe('<ShortUrlsListSettings />', () => {
  let wrapper: ShallowWrapper;
  const setSettings = jest.fn();
  const createWrapper = (shortUrlsList?: ShortUrlsSettings) => {
    wrapper = shallow(
      <ShortUrlsListSettings settings={Mock.of<Settings>({ shortUrlsList })} setShortUrlsListSettings={setSettings} />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [undefined, DEFAULT_SHORT_URLS_ORDERING],
    [{}, DEFAULT_SHORT_URLS_ORDERING],
    [{ defaultOrdering: {} }, {}],
    [{ defaultOrdering: { field: 'longUrl', dir: 'DESC' } as ShortUrlsOrder }, { field: 'longUrl', dir: 'DESC' }],
    [{ defaultOrdering: { field: 'visits', dir: 'ASC' } as ShortUrlsOrder }, { field: 'visits', dir: 'ASC' }],
  ])('shows expected ordering', (shortUrlsList, expectedOrder) => {
    const wrapper = createWrapper(shortUrlsList);
    const dropdown = wrapper.find(OrderingDropdown);

    expect(dropdown.prop('order')).toEqual(expectedOrder);
  });

  it.each([
    [undefined, undefined],
    ['longUrl', 'ASC'],
    ['visits', undefined],
    ['title', 'DESC'],
  ])('invokes setSettings when ordering changes', (field, dir) => {
    const wrapper = createWrapper();
    const dropdown = wrapper.find(OrderingDropdown);

    expect(setSettings).not.toHaveBeenCalled();
    dropdown.simulate('change', field, dir);
    expect(setSettings).toHaveBeenCalledWith({ defaultOrdering: { field, dir } });
  });
});
