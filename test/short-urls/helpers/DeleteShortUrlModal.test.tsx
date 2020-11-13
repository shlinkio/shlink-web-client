import { shallow, ShallowWrapper } from 'enzyme';
import { identity } from 'ramda';
import { Mock } from 'ts-mockery';
import DeleteShortUrlModal from '../../../src/short-urls/helpers/DeleteShortUrlModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShortUrlDeletion } from '../../../src/short-urls/reducers/shortUrlDeletion';
import { ProblemDetailsError } from '../../../src/utils/services/types';

describe('<DeleteShortUrlModal />', () => {
  let wrapper: ShallowWrapper;
  const shortUrl = Mock.of<ShortUrl>({
    tags: [],
    shortCode: 'abc123',
    longUrl: 'https://long-domain.com/foo/bar',
  });
  const deleteShortUrl = jest.fn(async () => Promise.resolve());
  const createWrapper = (shortUrlDeletion: Partial<ShortUrlDeletion>) => {
    wrapper = shallow(
      <DeleteShortUrlModal
        isOpen
        shortUrl={shortUrl}
        shortUrlDeletion={Mock.of<ShortUrlDeletion>(shortUrlDeletion)}
        toggle={() => {}}
        deleteShortUrl={deleteShortUrl}
        resetDeleteShortUrl={() => {}}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [
      { error: 'INVALID_SHORTCODE_DELETION' },
      'This short URL has received too many visits, and therefore, it cannot be deleted.',
    ],
    [
      { type: 'INVALID_SHORTCODE_DELETION' },
      'This short URL has received too many visits, and therefore, it cannot be deleted.',
    ],
    [
      { error: 'INVALID_SHORTCODE_DELETION', threshold: 35 },
      'This short URL has received more than 35 visits, and therefore, it cannot be deleted.',
    ],
    [
      { type: 'INVALID_SHORTCODE_DELETION', threshold: 8 },
      'This short URL has received more than 8 visits, and therefore, it cannot be deleted.',
    ],
  ])('shows threshold error message when threshold error occurs', (errorData: Partial<ProblemDetailsError>, expectedMessage) => {
    const wrapper = createWrapper({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: Mock.of<ProblemDetailsError>(errorData),
    });
    const warning = wrapper.find('.bg-warning');

    expect(warning).toHaveLength(1);
    expect(warning.html()).toContain(expectedMessage);
  });

  it('shows generic error when non-threshold error occurs', () => {
    const wrapper = createWrapper({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: Mock.of<ProblemDetailsError>({ error: 'OTHER_ERROR' }),
    });
    const error = wrapper.find('.bg-danger');

    expect(error).toHaveLength(1);
    expect(error.html()).toContain('Something went wrong while deleting the URL :(');
  });

  it('disables submit button when loading', () => {
    const wrapper = createWrapper({
      loading: true,
      error: false,
      shortCode: 'abc123',
    });
    const submit = wrapper.find('.btn-danger');

    expect(submit).toHaveLength(1);
    expect(submit.prop('disabled')).toEqual(true);
    expect(submit.html()).toContain('Deleting...');
  });

  it('enables submit button when proper short code is provided', (done) => {
    const shortCode = 'abc123';
    const wrapper = createWrapper({
      loading: false,
      error: false,
      shortCode,
    });
    const input = wrapper.find('.form-control');

    input.simulate('change', { target: { value: shortCode } });
    setImmediate(() => {
      const submit = wrapper.find('.btn-danger');

      expect(submit.prop('disabled')).toEqual(false);
      done();
    });
  });

  it('tries to delete short URL when form is submit', (done) => {
    const shortCode = 'abc123';
    const wrapper = createWrapper({
      loading: false,
      error: false,
      shortCode,
    });
    const input = wrapper.find('.form-control');

    input.simulate('change', { target: { value: shortCode } });
    setImmediate(() => {
      const form = wrapper.find('form');

      expect(deleteShortUrl).not.toHaveBeenCalled();
      form.simulate('submit', { preventDefault: identity });
      expect(deleteShortUrl).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
