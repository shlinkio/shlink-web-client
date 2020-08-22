import React from 'react';
import { shallow } from 'enzyme';
import { ButtonDropdown, DropdownItem } from 'reactstrap';
import createShortUrlsRowMenu from '../../../src/short-urls/helpers/ShortUrlsRowMenu';
import PreviewModal from '../../../src/short-urls/helpers/PreviewModal';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';

describe('<ShortUrlsRowMenu />', () => {
  let wrapper;
  const DeleteShortUrlModal = () => '';
  const EditTagsModal = () => '';
  const EditMetaModal = () => '';
  const EditShortUrlModal = () => '';
  const onCopyToClipboard = jest.fn();
  const selectedServer = { id: 'abc123' };
  const shortUrl = {
    shortCode: 'abc123',
    shortUrl: 'https://doma.in/abc123',
  };
  const createWrapper = () => {
    const ShortUrlsRowMenu = createShortUrlsRowMenu(
      DeleteShortUrlModal,
      EditTagsModal,
      EditMetaModal,
      EditShortUrlModal,
      () => '',
    );

    wrapper = shallow(
      <ShortUrlsRowMenu
        selectedServer={selectedServer}
        shortUrl={shortUrl}
        onCopyToClipboard={onCopyToClipboard}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders modal windows', () => {
    const wrapper = createWrapper();
    const deleteShortUrlModal = wrapper.find(DeleteShortUrlModal);
    const editTagsModal = wrapper.find(EditTagsModal);
    const previewModal = wrapper.find(PreviewModal);
    const qrCodeModal = wrapper.find(QrCodeModal);
    const editModal = wrapper.find(EditShortUrlModal);

    expect(deleteShortUrlModal).toHaveLength(1);
    expect(editTagsModal).toHaveLength(1);
    expect(previewModal).toHaveLength(1);
    expect(qrCodeModal).toHaveLength(1);
    expect(editModal).toHaveLength(1);
  });

  it('renders correct amount of menu items', () => {
    const wrapper = createWrapper();
    const items = wrapper.find(DropdownItem);

    expect(items).toHaveLength(8);
    expect(items.find('[divider]')).toHaveLength(1);
  });

  describe('toggles state when toggling modal windows', () => {
    const assert = (modalComponent) => {
      const wrapper = createWrapper();

      expect(wrapper.find(modalComponent).prop('isOpen')).toEqual(false);
      wrapper.find(modalComponent).prop('toggle')();
      expect(wrapper.find(modalComponent).prop('isOpen')).toEqual(true);
    };

    it('DeleteShortUrlModal', () => assert(DeleteShortUrlModal));
    it('EditTagsModal', () => assert(EditTagsModal));
    it('PreviewModal', () => assert(PreviewModal));
    it('QrCodeModal', () => assert(QrCodeModal));
    it('EditShortUrlModal', () => assert(EditShortUrlModal));
  });

  it('toggles dropdown state when toggling dropdown', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ButtonDropdown).prop('isOpen')).toEqual(false);
    wrapper.find(ButtonDropdown).prop('toggle')();
    expect(wrapper.find(ButtonDropdown).prop('isOpen')).toEqual(true);
  });
});
