import { shallow, ShallowWrapper } from 'enzyme';
import { FormGroup } from 'reactstrap';
import { Mock } from 'ts-mockery';
import EditShortUrlModal from '../../../src/short-urls/helpers/EditShortUrlModal';
import { ShortUrl } from '../../../src/short-urls/data';
import { ShortUrlEdition } from '../../../src/short-urls/reducers/shortUrlEdition';
import { Result } from '../../../src/utils/Result';

describe('<EditShortUrlModal />', () => {
  let wrapper: ShallowWrapper;
  const editShortUrl = jest.fn(async () => Promise.resolve());
  const toggle = jest.fn();
  const createWrapper = (shortUrl: Partial<ShortUrl>, shortUrlEdition: Partial<ShortUrlEdition>) => {
    wrapper = shallow(
      <EditShortUrlModal
        isOpen={true}
        shortUrl={Mock.of<ShortUrl>(shortUrl)}
        shortUrlEdition={Mock.of<ShortUrlEdition>(shortUrlEdition)}
        toggle={toggle}
        editShortUrl={editShortUrl}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());
  afterEach(jest.clearAllMocks);

  it.each([
    [ false, 0 ],
    [ true, 1 ],
  ])('properly renders form with expected components', (error, expectedErrorLength) => {
    const wrapper = createWrapper({}, { saving: false, error });
    const errorElement = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');
    const form = wrapper.find('form');
    const formGroup = form.find(FormGroup);

    expect(form).toHaveLength(1);
    expect(formGroup).toHaveLength(1);
    expect(errorElement).toHaveLength(expectedErrorLength);
  });

  it.each([
    [ true, 'Saving...', 'something', true ],
    [ true, 'Saving...', undefined, true ],
    [ false, 'Save', 'something', false ],
    [ false, 'Save', undefined, true ],
  ])('renders submit button on expected state', (saving, expectedText, longUrl, expectedDisabled) => {
    const wrapper = createWrapper({ longUrl }, { saving, error: false });
    const button = wrapper.find('[color="primary"]');

    expect(button.prop('disabled')).toEqual(expectedDisabled);
    expect(button.html()).toContain(expectedText);
  });

  it('saves data when form is submit', () => {
    const preventDefault = jest.fn();
    const wrapper = createWrapper({}, { saving: false, error: false });
    const form = wrapper.find('form');

    form.simulate('submit', { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(editShortUrl).toHaveBeenCalled();
  });

  it.each([
    [ '[color="link"]', 'onClick' ],
    [ 'Modal', 'toggle' ],
    [ 'ModalHeader', 'toggle' ],
  ])('toggles modal with different mechanisms', (componentToFind, propToCall) => {
    const wrapper = createWrapper({}, { saving: false, error: false });
    const component = wrapper.find(componentToFind);

    (component.prop(propToCall) as Function)(); // eslint-disable-line @typescript-eslint/no-unnecessary-type-assertion

    expect(toggle).toHaveBeenCalled();
  });
});
