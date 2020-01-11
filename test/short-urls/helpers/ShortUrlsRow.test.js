import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import Moment from 'react-moment';
import { assoc, toString } from 'ramda';
import { UncontrolledTooltip } from 'reactstrap';
import createShortUrlsRow from '../../../src/short-urls/helpers/ShortUrlsRow';
import ExternalLink from '../../../src/utils/ExternalLink';
import Tag from '../../../src/tags/helpers/Tag';

describe('<ShortUrlsRow />', () => {
  let wrapper;
  const mockFunction = () => '';
  const ShortUrlsRowMenu = mockFunction;
  const stateFlagTimeout = jest.fn();
  const colorGenerator = {
    getColorForKey: mockFunction,
    setColorForKey: mockFunction,
  };
  const server = {
    url: 'https://doma.in',
  };
  const shortUrl = {
    shortCode: 'abc123',
    shortUrl: 'http://doma.in/abc123',
    longUrl: 'http://foo.com/bar',
    dateCreated: moment('2018-05-23 18:30:41').format(),
    tags: [ 'nodejs', 'reactjs' ],
    visitsCount: 45,
  };
  const ShortUrlsRow = createShortUrlsRow(ShortUrlsRowMenu, colorGenerator, stateFlagTimeout);
  const createWrapper = (meta) => {
    wrapper = shallow(
      <ShortUrlsRow
        shortUrlsListParams={{}}
        refreshList={mockFunction}
        selecrtedServer={server}
        shortUrl={{ ...shortUrl, meta }}
      />
    );

    return wrapper;
  };

  afterEach(() => wrapper && wrapper.unmount());

  it('renders date in first column', () => {
    const wrapper = createWrapper();
    const col = wrapper.find('td').first();
    const moment = col.find(Moment);

    expect(moment.html()).toContain('>2018-05-23 18:30</time>');
  });

  it('renders short URL in second row', () => {
    const wrapper = createWrapper();
    const col = wrapper.find('td').at(1);
    const link = col.find(ExternalLink);

    expect(link.prop('href')).toEqual(shortUrl.shortUrl);
  });

  it('renders long URL in third row', () => {
    const wrapper = createWrapper();
    const col = wrapper.find('td').at(2);
    const link = col.find(ExternalLink);

    expect(link.prop('href')).toEqual(shortUrl.longUrl);
  });

  describe('renders list of tags in fourth row', () => {
    it('with tags', () => {
      const wrapper = createWrapper();
      const col = wrapper.find('td').at(3);
      const tags = col.find(Tag);

      expect(tags).toHaveLength(shortUrl.tags.length);
      shortUrl.tags.forEach((tagValue, index) => {
        const tag = tags.at(index);

        expect(tag.prop('text')).toEqual(tagValue);
      });
    });

    it('without tags', () => {
      const wrapper = createWrapper();

      wrapper.setProps({ shortUrl: assoc('tags', [], shortUrl) });

      const col = wrapper.find('td').at(3);

      expect(col.text()).toContain('No tags');
    });
  });

  it('renders visits count in fifth row', () => {
    const wrapper = createWrapper();
    const col = wrapper.find('td').at(4);
    const maxVisitsHelper = wrapper.find('.short-urls-row__max-visits-control');

    expect(col.text()).toEqual(toString(shortUrl.visitsCount));
    expect(maxVisitsHelper).toHaveLength(0);
  });

  it('renders visits count with helper control displaying the maximum amount of visits', () => {
    const maxVisits = 40;
    const wrapper = createWrapper({ maxVisits });
    const maxVisitsHelper = wrapper.find('.short-urls-row__max-visits-control');
    const maxVisitsTooltip = wrapper.find(UncontrolledTooltip);

    expect(maxVisitsHelper).toHaveLength(1);
    expect(maxVisitsTooltip).toHaveLength(1);
  });

  it('updates state when copied to clipboard', () => {
    const wrapper = createWrapper();
    const col = wrapper.find('td').at(5);
    const menu = col.find(ShortUrlsRowMenu);

    expect(menu).toHaveLength(1);
    expect(stateFlagTimeout).not.toHaveBeenCalled();
    menu.simulate('copyToClipboard');
    expect(stateFlagTimeout).toHaveBeenCalledTimes(1);
  });

  it('shows copy hint when state prop is true', () => {
    const wrapper = createWrapper();
    const isHidden = () => wrapper.find('td').at(5).find('.short-urls-row__copy-hint').prop('hidden');

    expect(isHidden()).toEqual(true);
    wrapper.setState({ copiedToClipboard: true });
    expect(isHidden()).toEqual(false);
  });
});
