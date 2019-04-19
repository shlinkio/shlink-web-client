import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import { identity } from 'ramda';
import createShortUrlsCreator from '../../src/short-urls/CreateShortUrl';
import DateInput from '../../src/utils/DateInput';

describe('<CreateShortUrl />', () => {
  let wrapper;
  const TagsSelector = () => '';
  const shortUrlCreationResult = {
    loading: false,
  };
  const createShortUrl = jest.fn();

  beforeEach(() => {
    const CreateShortUrl = createShortUrlsCreator(TagsSelector, () => '');

    wrapper = shallow(
      <CreateShortUrl shortUrlCreationResult={shortUrlCreationResult} createShortUrl={createShortUrl} />
    );
  });
  afterEach(() => {
    wrapper.unmount();
    createShortUrl.mockReset();
  });

  it('saves short URL with data set in form controls', (done) => {
    const validSince = moment('2017-01-01');
    const validUntil = moment('2017-01-06');

    const urlInput = wrapper.find('.form-control-lg');
    const tagsInput = wrapper.find(TagsSelector);
    const customSlugInput = wrapper.find('#customSlug');
    const maxVisitsInput = wrapper.find('#maxVisits');
    const dateInputs = wrapper.find(DateInput);
    const validSinceInput = dateInputs.at(0);
    const validUntilInput = dateInputs.at(1);

    urlInput.simulate('change', { target: { value: 'https://long-domain.com/foo/bar' } });
    tagsInput.simulate('change', [ 'tag_foo', 'tag_bar' ]);
    customSlugInput.simulate('change', { target: { value: 'my-slug' } });
    maxVisitsInput.simulate('change', { target: { value: '20' } });
    validSinceInput.simulate('change', validSince);
    validUntilInput.simulate('change', validUntil);

    setImmediate(() => {
      const form = wrapper.find('form');

      form.simulate('submit', { preventDefault: identity });
      expect(createShortUrl).toHaveBeenCalledTimes(1);
      expect(createShortUrl).toHaveBeenCalledWith({
        longUrl: 'https://long-domain.com/foo/bar',
        tags: [ 'tag_foo', 'tag_bar' ],
        customSlug: 'my-slug',
        validSince: validSince.format(),
        validUntil: validUntil.format(),
        maxVisits: '20',
        findIfExists: false,
      });
      done();
    });
  });
});
