import React from 'react';
import { shallow } from 'enzyme';
import { Modal } from 'reactstrap';
import each from 'jest-each';
import createEditTagsModal from '../../../src/short-urls/helpers/EditTagsModal';

describe('<EditTagsModal />', () => {
  let wrapper;
  const shortCode = 'abc123';
  const TagsSelector = () => '';
  const editShortUrlTags = jest.fn(() => Promise.resolve());
  const resetShortUrlsTags = jest.fn();
  const toggle = jest.fn();
  const createWrapper = (shortUrlTags, domain) => {
    const EditTagsModal = createEditTagsModal(TagsSelector);

    wrapper = shallow(
      <EditTagsModal
        isOpen={true}
        shortUrl={{
          tags: [],
          shortCode,
          domain,
          originalUrl: 'https://long-domain.com/foo/bar',
        }}
        shortUrlTags={shortUrlTags}
        toggle={toggle}
        editShortUrlTags={editShortUrlTags}
        resetShortUrlsTags={resetShortUrlsTags}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    jest.clearAllMocks();
  });

  it('resets tags when component is mounted', () => {
    createWrapper({
      shortCode,
      tags: [],
      saving: false,
      error: false,
    });

    expect(resetShortUrlsTags).toHaveBeenCalledTimes(1);
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

  each([[ undefined ], [ null ], [ 'example.com' ]]).it('saves tags when save button is clicked', (domain, done) => {
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
    const modal = wrapper.find(Modal);

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
