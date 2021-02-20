import { shallow, ShallowWrapper } from 'enzyme';
import { FormGroup } from 'reactstrap';
import { Mock } from 'ts-mockery';
import EditMetaModal from '../../../src/short-urls/helpers/EditMetaModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShortUrlMetaEdition } from '../../../src/short-urls/reducers/shortUrlMeta';
import { Result } from '../../../src/utils/Result';

describe('<EditMetaModal />', () => {
  let wrapper: ShallowWrapper;
  const editShortUrlMeta = jest.fn(async () => Promise.resolve());
  const resetShortUrlMeta = jest.fn();
  const toggle = jest.fn();
  const createWrapper = (shortUrlMeta: Partial<ShortUrlMetaEdition>) => {
    wrapper = shallow(
      <EditMetaModal
        isOpen={true}
        shortUrl={Mock.all<ShortUrl>()}
        shortUrlMeta={Mock.of<ShortUrlMetaEdition>(shortUrlMeta)}
        toggle={toggle}
        editShortUrlMeta={editShortUrlMeta}
        resetShortUrlMeta={resetShortUrlMeta}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it('properly renders form with components', () => {
    const wrapper = createWrapper({ saving: false, error: false });
    const error = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');
    const form = wrapper.find('form');
    const formGroup = form.find(FormGroup);

    expect(form).toHaveLength(1);
    expect(formGroup).toHaveLength(3);
    expect(error).toHaveLength(0);
  });

  it.each([
    [ true, 'Saving...' ],
    [ false, 'Save' ],
  ])('renders submit button on expected state', (saving, expectedText) => {
    const wrapper = createWrapper({ saving, error: false });
    const button = wrapper.find('[type="submit"]');

    expect(button.prop('disabled')).toEqual(saving);
    expect(button.text()).toContain(expectedText);
  });

  it('renders error message on error', () => {
    const wrapper = createWrapper({ saving: false, error: true });
    const error = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');

    expect(error).toHaveLength(1);
  });

  it('saves meta when form is submit', () => {
    const preventDefault = jest.fn();
    const wrapper = createWrapper({ saving: false, error: false });
    const form = wrapper.find('form');

    form.simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(editShortUrlMeta).toHaveBeenCalled();
  });

  it.each([
    [ '.btn-link', 'onClick' ],
    [ 'BlurredModal', 'toggle' ],
    [ 'ModalHeader', 'toggle' ],
  ])('resets meta when modal is toggled in any way', (componentToFind, propToCall) => {
    const wrapper = createWrapper({ saving: false, error: false });
    const component = wrapper.find(componentToFind);

    (component.prop(propToCall) as Function)(); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion

    expect(resetShortUrlMeta).toHaveBeenCalled();
  });
});
