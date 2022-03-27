import { shallow } from 'enzyme';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { SimpleCard } from '../../src/utils/SimpleCard';

describe('<SimpleCard />', () => {
  it.each([
    [{}, 0],
    [{ title: 'Cool title' }, 1],
  ])('renders header only if title is provided', (props, expectedAmountOfHeaders) => {
    const wrapper = shallow(<SimpleCard {...props} />);

    expect(wrapper.find(CardHeader)).toHaveLength(expectedAmountOfHeaders);
  });

  it('renders children inside body', () => {
    const wrapper = shallow(<SimpleCard>Hello world</SimpleCard>);
    const body = wrapper.find(CardBody);

    expect(body).toHaveLength(1);
    expect(body.html()).toContain('Hello world');
  });

  it('passes extra props to nested card', () => {
    const wrapper = shallow(<SimpleCard className="foo" color="primary">Hello world</SimpleCard>);
    const card = wrapper.find(Card);

    expect(card.prop('className')).toEqual('foo');
    expect(card.prop('color')).toEqual('primary');
  });
});
