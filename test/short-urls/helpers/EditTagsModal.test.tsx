import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import createEditTagsModal from '../../../src/short-urls/helpers/EditTagsModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShortUrlTags } from '../../../src/short-urls/reducers/shortUrlTags';
import { OptionalString } from '../../../src/utils/utils';
import { BlurredModal } from '../../../src/utils/BlurredModal';

describe('<EditTagsModal />', () => {
  let wrapper: ShallowWrapper;
  const shortCode = 'abc123';
  const TagsSelector = () => null;
  const editShortUrlTags = jest.fn(async () => Promise.resolve());
  const resetShortUrlsTags = jest.fn();
  const toggle = jest.fn();
  const createWrapper = (shortUrlTags: ShortUrlTags, domain?: OptionalString) => {
    const EditTagsModal = createEditTagsModal(TagsSelector);

    wrapper = shallow(
      <EditTagsModal
        isOpen={true}
        shortUrl={Mock.of<ShortUrl>({
          tags: [],
          shortCode,
          domain,
          longUrl: 'https://long-domain.com/foo/bar',
        })}
        shortUrlTags={shortUrlTags}
        toggle={toggle}
        editShortUrlTags={editShortUrlTags}
        resetShortUrlsTags={resetShortUrlsTags}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('renders tags selector and save button when loaded', () => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: false,
      error: false,
    });
    const saveBtn = wrapper.find('.btn-primary');

    expect(wrapper.find(TagsSelector)).toHaveLength(1);
    expect(saveBtn.prop('disabled')).toBe(false);
    expect(saveBtn.text()).toEqual('Save tags');
  });

  it('disables save button when saving is in progress', () => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: true,
      error: false,
    });
    const saveBtn = wrapper.find('.btn-primary');

    expect(saveBtn.prop('disabled')).toBe(true);
    expect(saveBtn.text()).toEqual('Saving tags...');
  });

  it.each([
    [ undefined ],
    [ null ],
    [ 'example.com' ],
    // @ts-expect-error
  ])('saves tags when save button is clicked', (domain: OptionalString, done: jest.DoneCallback) => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: true,
      error: false,
    }, domain);
    const saveBtn = wrapper.find('.btn-primary');

    saveBtn.simulate('click');

    expect(editShortUrlTags).toHaveBeenCalledTimes(1);
    expect(editShortUrlTags).toHaveBeenCalledWith(shortCode, domain, []);

    // Wrap this expect in a setImmediate since it is called as a result of an inner promise
    setImmediate(() => {
      expect(toggle).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('does not notify tags have been edited when window is closed without saving', () => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: false,
      error: false,
    });
    const modal = wrapper.find(BlurredModal);

    modal.simulate('closed');
    expect(editShortUrlTags).not.toHaveBeenCalled();
  });

  it('toggles modal when cancel button is clicked', () => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: true,
      error: false,
    });
    const cancelBtn = wrapper.find('.btn-link');

    cancelBtn.simulate('click');
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
