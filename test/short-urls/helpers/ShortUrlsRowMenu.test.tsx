import { shallow, ShallowWrapper } from 'enzyme';
import { ButtonDropdown, DropdownItem } from 'reactstrap';
import { Mock } from 'ts-mockery';
import createShortUrlsRowMenu from '../../../src/short-urls/helpers/ShortUrlsRowMenu';
import { ReachableServer } from '../../../src/servers/data';
import { ShortUrl } from '../../../src/short-urls/data';

describe('<ShortUrlsRowMenu />', () => {
  let wrapper: ShallowWrapper;
  const DeleteShortUrlModal = () => null;
  const EditTagsModal = () => null;
  const EditMetaModal = () => null;
  const EditShortUrlModal = () => null;
  const QrCodeModal = () => null;
  const selectedServer = Mock.of<ReachableServer>({ id: 'abc123' });
  const shortUrl = Mock.of<ShortUrl>({
    shortCode: 'abc123',
    shortUrl: 'https://doma.in/abc123',
  });
  const createWrapper = () => {
    const ShortUrlsRowMenu = createShortUrlsRowMenu(
      DeleteShortUrlModal,
      EditTagsModal,
      EditMetaModal,
      EditShortUrlModal,
      QrCodeModal,
      () => null,
    );

    wrapper = shallow(<ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders modal windows', () => {
    const wrapper = createWrapper();
    const deleteShortUrlModal = wrapper.find(DeleteShortUrlModal);
    const editTagsModal = wrapper.find(EditTagsModal);
    const qrCodeModal = wrapper.find(QrCodeModal);
    const editModal = wrapper.find(EditShortUrlModal);

    expect(deleteShortUrlModal).toHaveLength(1);
    expect(editTagsModal).toHaveLength(1);
    expect(qrCodeModal).toHaveLength(1);
    expect(editModal).toHaveLength(1);
  });

  it('renders correct amount of menu items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(7);
    expect(items.find('[divider]')).toHaveLength(1);
  });

  describe('toggles state when toggling modals or the dropdown', () => {
    const assert = (modalComponent: Function) => {
      const wrapper = createWrapper();

      expect(wrapper.find(modalComponent).prop('isOpen')).toEqual(false);
      (wrapper.find(modalComponent).prop('toggle') as Function)();
      expect(wrapper.find(modalComponent).prop('isOpen')).toEqual(true);
    };

    it('DeleteShortUrlModal', () => assert(DeleteShortUrlModal));
    it('EditTagsModal', () => assert(EditTagsModal));
    it('QrCodeModal', () => assert(QrCodeModal));
    it('EditShortUrlModal', () => assert(EditShortUrlModal));
    it('EditShortUrlModal', () => assert(ButtonDropdown));
  });
});
