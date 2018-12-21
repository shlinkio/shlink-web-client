import React from 'react';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import { Modal } from 'reactstrap';
import createEditTagsModal from '../../../src/short-urls/helpers/EditTagsModal';

describe('<EditTagsModal />', () => {
  let wrapper;
  const shortCode = 'abc123';
  const TagsSelector = () => '';
  const editShortUrlTags = sinon.fake.resolves();
  const shortUrlTagsEdited = sinon.fake();
  const resetShortUrlsTags = sinon.fake();
  const toggle = sinon.fake();
  const createWrapper = (shortUrlTags) => {
    const EditTagsModal = createEditTagsModal(TagsSelector);

    wrapper = shallow(
      <EditTagsModal
        isOpen={true}
        url={''}
        shortUrl={{
          tags: [],
          shortCode,
          originalUrl: 'https://long-domain.com/foo/bar',
        }}
        shortUrlTags={shortUrlTags}
        toggle={toggle}
        editShortUrlTags={editShortUrlTags}
        shortUrlTagsEdited={shortUrlTagsEdited}
        resetShortUrlsTags={resetShortUrlsTags}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    editShortUrlTags.resetHistory();
    shortUrlTagsEdited.resetHistory();
    resetShortUrlsTags.resetHistory();
    toggle.resetHistory();
  });

  it('resets tags when component is mounted', () => {
    createWrapper({
      shortCode,
      tags: [],
      saving: false,
      error: false,
    });

    expect(resetShortUrlsTags.callCount).toEqual(1);
  });

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

  it('saves tags when save button is clicked', (done) => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: true,
      error: false,
    });
    const saveBtn = wrapper.find('.btn-primary');

    saveBtn.simulate('click');

    expect(editShortUrlTags.callCount).toEqual(1);
    expect(editShortUrlTags.getCall(0).args).toEqual([ shortCode, []]);

    // Wrap this expect in a setImmediate since it is called as a result of an inner promise
    setImmediate(() => {
      expect(toggle.callCount).toEqual(1);
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
    const modal = wrapper.find(Modal);

    modal.simulate('closed');
    expect(shortUrlTagsEdited.callCount).toEqual(0);
  });

  it('notifies tags have been edited when window is closed after saving', (done) => {
    const wrapper = createWrapper({
      shortCode,
      tags: [],
      saving: true,
      error: false,
    });
    const saveBtn = wrapper.find('.btn-primary');
    const modal = wrapper.find(Modal);

    saveBtn.simulate('click');

    // Wrap this expect in a setImmediate since it is called as a result of an inner promise
    setImmediate(() => {
      modal.simulate('closed');
      expect(shortUrlTagsEdited.callCount).toEqual(1);
      expect(shortUrlTagsEdited.getCall(0).args).toEqual([ shortCode, []]);
      done();
    });
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
    expect(toggle.callCount).toEqual(1);
  });
});
