import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import shortUrlsCreator from '../../src/short-urls/ShortUrls';
import Paginator from '../../src/short-urls/Paginator';
import { ShortUrlsListProps } from '../../src/short-urls/ShortUrlsList';

describe('<ShortUrls />', () => {
  let wrapper: ShallowWrapper;
  const SearchBar = () => null;
  const ShortUrlsList = () => null;

  beforeEach(() => {
    const ShortUrls = shortUrlsCreator(SearchBar, ShortUrlsList);

    wrapper = shallow(
      <ShortUrls {...Mock.all<ShortUrlsListProps>()} />,
    );
  });
  afterEach(() => wrapper.unmount());

  it('wraps a SearchBar, ShortUrlsList as Paginator', () => {
    expect(wrapper.find(SearchBar)).toHaveLength(1);
    expect(wrapper.find(ShortUrlsList)).toHaveLength(1);
    expect(wrapper.find(Paginator)).toHaveLength(1);
  });
});
