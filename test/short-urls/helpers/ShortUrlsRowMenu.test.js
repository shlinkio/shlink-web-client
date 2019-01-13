import React from 'react';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import { ButtonDropdown, DropdownItem } from 'reactstrap';
import createShortUrlsRowMenu from '../../../src/short-urls/helpers/ShortUrlsRowMenu';
import PreviewModal from '../../../src/short-urls/helpers/PreviewModal';
import QrCodeModal from '../../../src/short-urls/helpers/QrCodeModal';

describe('<ShortUrlsRowMenu />', () => {
  let wrapper;
  const DeleteShortUrlModal = () => '';
  const EditTagsModal = () => '';
  const onCopyToClipboard = sinon.spy();
  const selectedServer = { id: 'abc123' };
  const shortUrl = {
    shortCode: 'abc123',
    shortUrl: 'https://doma.in/abc123',
  };

  beforeEach(() => {
    const ShortUrlsRowMenu = createShortUrlsRowMenu(DeleteShortUrlModal, EditTagsModal);

    wrapper = shallow(
      <ShortUrlsRowMenu selectedServer={selectedServer} shortUrl={shortUrl} onCopyToClipboard={onCopyToClipboard} />
    );
  });

  afterEach(() => wrapper.unmount());

  it('renders modal windows', () => {
    const deleteShortUrlModal = wrapper.find(DeleteShortUrlModal);
    const editTagsModal = wrapper.find(EditTagsModal);
    const previewModal = wrapper.find(PreviewModal);
    const qrCodeModal = wrapper.find(QrCodeModal);

    expect(deleteShortUrlModal).toHaveLength(1);
    expect(editTagsModal).toHaveLength(1);
    expect(previewModal).toHaveLength(1);
    expect(qrCodeModal).toHaveLength(1);
  });

  it('renders correct amount of menu items', () => {
    const items = wrapper.find(DropdownItem);
    const expectedNonDividerItems = 6;
    const expectedDividerItems = 2;

    expect(items).toHaveLength(expectedNonDividerItems + expectedDividerItems);
    expect(items.find('[divider]')).toHaveLength(expectedDividerItems);
  });

  describe('toggles state when toggling modal windows', () => {
    const assert = (modalComponent, stateProp, done) => {
      const modal = wrapper.find(modalComponent);

      expect(wrapper.state(stateProp)).toEqual(false);
      modal.prop('toggle')();
      setImmediate(() => {
        expect(wrapper.state(stateProp)).toEqual(true);
        done();
      });
    };

    it('DeleteShortUrlModal', (done) => assert(DeleteShortUrlModal, 'isDeleteModalOpen', done));
    it('EditTagsModal', (done) => assert(EditTagsModal, 'isTagsModalOpen', done));
    it('PreviewModal', (done) => assert(PreviewModal, 'isPreviewModalOpen', done));
    it('QrCodeModal', (done) => assert(QrCodeModal, 'isQrModalOpen', done));
  });

  it('toggles dropdown state when toggling dropdown', (done) => {
    const dropdown = wrapper.find(ButtonDropdown);

    expect(wrapper.state('isOpen')).toEqual(false);
    dropdown.prop('toggle')();
    setImmediate(() => {
      expect(wrapper.state('isOpen')).toEqual(true);
      done();
    });
  });
});
