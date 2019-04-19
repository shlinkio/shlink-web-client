import React from 'react';
import { shallow } from 'enzyme';
import { identity } from 'ramda';
import DeleteShortUrlModal from '../../../src/short-urls/helpers/DeleteShortUrlModal';

describe('<DeleteShortUrlModal />', () => {
  let wrapper;
  const shortUrl = {
    tags: [],
    shortCode: 'abc123',
    originalUrl: 'https://long-domain.com/foo/bar',
  };
  const deleteShortUrl = jest.fn(() => Promise.resolve());
  const createWrapper = (shortUrlDeletion) => {
    wrapper = shallow(
      <DeleteShortUrlModal
        isOpen
        shortUrl={shortUrl}
        shortUrlDeletion={shortUrlDeletion}
        toggle={identity}
        deleteShortUrl={deleteShortUrl}
        resetDeleteShortUrl={identity}
        shortUrlDeleted={identity}
      />
    );

    return wrapper;
  };

  afterEach(() => {
    wrapper && wrapper.unmount();
    deleteShortUrl.mockClear();
  });

  it('shows threshold error message when threshold error occurs', () => {
    const wrapper = createWrapper({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: { error: 'INVALID_SHORTCODE_DELETION' },
    });
    const warning = wrapper.find('.bg-warning');

    expect(warning).toHaveLength(1);
    expect(warning.html()).toContain('This short URL has received too many visits and therefore, it cannot be deleted');
  });

  it('shows generic error when non-threshold error occurs', () => {
    const wrapper = createWrapper({
      loading: false,
      error: true,
      shortCode: 'abc123',
      errorData: { error: 'OTHER_ERROR' },
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
      errorData: {},
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
      errorData: {},
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
      errorData: {},
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
