import { shallow, ShallowWrapper } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { Mock } from 'ts-mockery';
import ShortUrlVisitsCount from '../../../src/short-urls/helpers/ShortUrlVisitsCount';
import { ShortUrl } from '../../../src/short-urls/data';

describe('<ShortUrlVisitsCount />', () => {
  let wrapper: ShallowWrapper;

  const createWrapper = (visitsCount: number, shortUrl: ShortUrl) => {
    wrapper = shallow(<ShortUrlVisitsCount visitsCount={visitsCount} shortUrl={shortUrl} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([undefined, {}])('just returns visits when no maxVisits is provided', (meta) => {
    const visitsCount = 45;
    const wrapper = createWrapper(visitsCount, Mock.of<ShortUrl>({ meta }));
    const maxVisitsHelper = wrapper.find('.short-urls-visits-count__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(wrapper.html()).toEqual(
      `<span><strong class="short-url-visits-count__amount">${visitsCount}</strong></span>`,
    );
    expect(maxVisitsHelper).toHaveLength(0);
    expect(maxVisitsTooltip).toHaveLength(0);
  });

  it('displays the maximum amount of visits when present', () => {
    const visitsCount = 45;
    const maxVisits = 500;
    const meta = { maxVisits };
    const wrapper = createWrapper(visitsCount, Mock.of<ShortUrl>({ meta }));
    const maxVisitsHelper = wrapper.find('.short-urls-visits-count__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(wrapper.html()).toContain(`/ ${maxVisits}`);
    expect(maxVisitsHelper).toHaveLength(1);
    expect(maxVisitsTooltip).toHaveLength(1);
  });
});
