import { shallow, ShallowWrapper } from 'enzyme';
import { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'reactstrap';
import Message, { MessageProps } from '../../src/utils/Message';

describe('<Message />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (props: PropsWithChildren<MessageProps> = {}) => {
    wrapper = shallow(<Message {...props} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it.each([
    [true, 1, 0],
    [false, 0, 1],
    [undefined, 0, 1],
  ])('renders expected classes based on width', (fullWidth, expectedFull, expectedNonFull) => {
    const wrapper = createWrapper({ fullWidth });

    expect(wrapper.find('.col-md-12')).toHaveLength(expectedFull);
    expect(wrapper.find('.col-md-10')).toHaveLength(expectedNonFull);
  });

  it.each([
    [true, 'These are the children contents'],
    [false, 'These are the children contents'],
    [true, undefined],
    [false, undefined],
  ])('renders expected content', (loading, children) => {
    const wrapper = createWrapper({ loading, children });

    expect(wrapper.find(FontAwesomeIcon)).toHaveLength(loading ? 1 : 0);

    if (loading) {
      expect(wrapper.find('span').text()).toContain(children || 'Loading...');
    } else {
      expect(wrapper.find('span')).toHaveLength(0);
      expect(wrapper.find('h3').text()).toContain(children || '');
    }
  });

  it.each([
    ['error', 'border-danger', 'text-danger'],
    ['default', '', 'text-muted'],
    [undefined, '', 'text-muted'],
  ])('renders proper classes based on message type', (type, expectedCardClass, expectedH3Class) => {
    const wrapper = createWrapper({ type: type as 'default' | 'error' | undefined });
    const card = wrapper.find(Card);
    const h3 = wrapper.find('h3');

    expect(card.prop('className')).toEqual(expectedCardClass);
    expect(h3.prop('className')).toEqual(`text-center mb-0 ${expectedH3Class}`);
  });

  it.each([{ className: 'foo' }, { className: 'bar' }, {}])('renders provided classes', ({ className }) => {
    const wrapper = createWrapper({ className });

    expect(wrapper.prop('className')).toEqual(`g-0${className ? ` ${className}` : ''}`);
  });
});
