import { shallow, ShallowWrapper } from 'enzyme';
import { formatISO } from 'date-fns';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { Input } from 'reactstrap';
import { ShortUrlForm as createShortUrlForm, Mode } from '../../src/short-urls/ShortUrlForm';
import { DateInput } from '../../src/utils/DateInput';
import { ShortUrlData } from '../../src/short-urls/data';
import { ReachableServer, SelectedServer } from '../../src/servers/data';
import { SimpleCard } from '../../src/utils/SimpleCard';
import { parseDate } from '../../src/utils/helpers/date';
import { OptionalString } from '../../src/utils/utils';

describe('<ShortUrlForm />', () => {
  let wrapper: ShallowWrapper;
  const TagsSelector = () => null;
  const DomainSelector = () => null;
  const createShortUrl = jest.fn(async () => Promise.resolve());
  const createWrapper = (selectedServer: SelectedServer = null, mode: Mode = 'create', title?: OptionalString) => {
    const ShortUrlForm = createShortUrlForm(TagsSelector, DomainSelector);

    wrapper = shallow(
      <ShortUrlForm
        selectedServer={selectedServer}
        mode={mode}
        saving={false}
        initialState={Mock.of<ShortUrlData>({ validateUrl: true, findIfExists: false, title })}
        onSave={createShortUrl}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper.unmount());
  afterEach(jest.clearAllMocks);

  it('saves short URL with data set in form controls', () => {
    const wrapper = createWrapper();
    const validSince = parseDate('2017-01-01', 'yyyy-MM-dd');
    const validUntil = parseDate('2017-01-06', 'yyyy-MM-dd');

    wrapper.find(Input).first().simulate('change', { target: { value: 'https://long-domain.com/foo/bar' } });
    wrapper.find('TagsSelector').simulate('change', ['tag_foo', 'tag_bar']);
    wrapper.find('#customSlug').simulate('change', { target: { value: 'my-slug' } });
    wrapper.find(DomainSelector).simulate('change', 'example.com');
    wrapper.find('#maxVisits').simulate('change', { target: { value: '20' } });
    wrapper.find('#shortCodeLength').simulate('change', { target: { value: 15 } });
    wrapper.find(DateInput).at(0).simulate('change', validSince);
    wrapper.find(DateInput).at(1).simulate('change', validUntil);
    wrapper.find('form').simulate('submit', { preventDefault: identity });

    expect(createShortUrl).toHaveBeenCalledTimes(1);
    expect(createShortUrl).toHaveBeenCalledWith({
      longUrl: 'https://long-domain.com/foo/bar',
      tags: ['tag_foo', 'tag_bar'],
      customSlug: 'my-slug',
      domain: 'example.com',
      validSince: formatISO(validSince),
      validUntil: formatISO(validUntil),
      maxVisits: 20,
      findIfExists: false,
      shortCodeLength: 15,
      validateUrl: true,
    });
  });

  it.each([
    ['create' as Mode, 4],
    ['create-basic' as Mode, 0],
  ])(
    'renders expected amount of cards based on server capabilities and mode',
    (mode, expectedAmountOfCards) => {
      const wrapper = createWrapper(null, mode);
      const cards = wrapper.find(SimpleCard);

      expect(cards).toHaveLength(expectedAmountOfCards);
    },
  );

  it.each([
    [null, 'new title', 'new title'],
    [undefined, 'new title', 'new title'],
    ['', 'new title', 'new title'],
    [null, '', undefined],
    [null, null, undefined],
    ['', '', undefined],
    [undefined, undefined, undefined],
    ['old title', null, null],
    ['old title', undefined, null],
    ['old title', '', null],
  ])('sends expected title based on original and new values', (originalTitle, newTitle, expectedSentTitle) => {
    const wrapper = createWrapper(Mock.of<ReachableServer>({ version: '2.6.0' }), 'create', originalTitle);

    wrapper.find('#title').simulate('change', { target: { value: newTitle } });
    wrapper.find('form').simulate('submit', { preventDefault: identity });

    expect(createShortUrl).toHaveBeenCalledWith(expect.objectContaining({
      title: expectedSentTitle,
    }));
  });
});
