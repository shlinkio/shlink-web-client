import { shallow, ShallowWrapper } from 'enzyme';
import { ReactNode } from 'react';
import { Card, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HighlightCard, HighlightCardProps } from '../../../src/servers/helpers/HighlightCard';

describe('<HighlightCard />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: HighlightCardProps & { children?: ReactNode }) => {
    wrapper = shallow(<HighlightCard {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [undefined],
    [false],
  ])('renders expected components', (link) => {
    const wrapper = createWrapper({ title: 'foo', link: link as undefined | false });

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle)).toHaveLength(1);
    expect(wrapper.find(CardText)).toHaveLength(1);
    expect(wrapper.find(FontAwesomeIcon)).toHaveLength(0);
    expect(wrapper.prop('tag')).not.toEqual(Link);
    expect(wrapper.prop('to')).not.toBeDefined();
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided title', (title) => {
    const wrapper = createWrapper({ title });
    const cardTitle = wrapper.find(CardTitle);

    expect(cardTitle.html()).toContain(`>${title}<`);
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('renders provided children', (children) => {
    const wrapper = createWrapper({ title: 'foo', children });
    const cardText = wrapper.find(CardText);

    expect(cardText.html()).toContain(`>${children}<`);
  });

  it.each([
    ['foo'],
    ['bar'],
    ['baz'],
  ])('adds extra props when a link is provided', (link) => {
    const wrapper = createWrapper({ title: 'foo', link });

    expect(wrapper.find(FontAwesomeIcon)).toHaveLength(1);
    expect(wrapper.prop('tag')).toEqual(Link);
    expect(wrapper.prop('to')).toEqual(link);
  });
});
