import { shallow, ShallowWrapper } from 'enzyme';
import moment from 'moment';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import { Input } from 'reactstrap';
import { ShortUrlForm as createShortUrlForm } from '../../src/short-urls/ShortUrlForm';
import DateInput from '../../src/utils/DateInput';
import { ShortUrlData } from '../../src/short-urls/data';

describe('<ShortUrlForm />', () => {
  let wrapper: ShallowWrapper;
  const TagsSelector = () => null;
  const createShortUrl = jest.fn();

  beforeEach(() => {
    const ShortUrlForm = createShortUrlForm(TagsSelector, () => null, () => null);

    wrapper = shallow(
      <ShortUrlForm
        selectedServer={null}
        mode="create"
        saving={false}
        initialState={Mock.of<ShortUrlData>({ validateUrl: true, findIfExists: false })}
        onSave={createShortUrl}
      />,
    );
  });
  afterEach(() => wrapper.unmount());
  afterEach(jest.clearAllMocks);

  it('saves short URL with data set in form controls', () => {
    const validSince = moment('2017-01-01');
    const validUntil = moment('2017-01-06');

    wrapper.find(Input).first().simulate('change', { target: { value: 'https://long-domain.com/foo/bar' } });
    wrapper.find('TagsSelector').simulate('change', [ 'tag_foo', 'tag_bar' ]);
    wrapper.find('#customSlug').simulate('change', { target: { value: 'my-slug' } });
    wrapper.find('#domain').simulate('change', { target: { value: 'example.com' } });
    wrapper.find('#maxVisits').simulate('change', { target: { value: '20' } });
    wrapper.find('#shortCodeLength').simulate('change', { target: { value: 15 } });
    wrapper.find(DateInput).at(0).simulate('change', validSince);
    wrapper.find(DateInput).at(1).simulate('change', validUntil);
    wrapper.find('form').simulate('submit', { preventDefault: identity });

    expect(createShortUrl).toHaveBeenCalledTimes(1);
    expect(createShortUrl).toHaveBeenCalledWith({
      longUrl: 'https://long-domain.com/foo/bar',
      tags: [ 'tag_foo', 'tag_bar' ],
      customSlug: 'my-slug',
      domain: 'example.com',
      validSince: validSince.format(),
      validUntil: validUntil.format(),
      maxVisits: '20',
      findIfExists: false,
      shortCodeLength: 15,
      validateUrl: true,
    });
  });
});
