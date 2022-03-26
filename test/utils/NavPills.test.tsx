import { shallow } from 'enzyme';
import { Card, Nav } from 'reactstrap';
import { NavPillItem, NavPills } from '../../src/utils/NavPills';

describe('<NavPills />', () => {
  it.each([
    ['Foo'],
    [<span key="1">Hi!</span>],
    [[<NavPillItem key="1" to="" />, <span key="2">Hi!</span>]],
  ])('throws error when any of the children is not a NavPillItem', (children) => {
    expect.assertions(1);

    try {
      shallow(<NavPills>{children}</NavPills>);
    } catch (e: any) {
      expect(e.message).toEqual('Only NavPillItem children are allowed inside NavPills.');
    }
  });

  it.each([
    [undefined],
    [true],
    [false],
  ])('renders provided items', (fill) => {
    const wrapper = shallow(
      <NavPills fill={fill}>
        <NavPillItem to="1">1</NavPillItem>
        <NavPillItem to="2">2</NavPillItem>
        <NavPillItem to="3">3</NavPillItem>
      </NavPills>,
    );
    const card = wrapper.find(Card);
    const nav = wrapper.find(Nav);

    expect(card).toHaveLength(1);
    expect(card.prop('body')).toEqual(true);
    expect(nav).toHaveLength(1);
    expect(nav.prop('pills')).toEqual(true);
    expect(nav.prop('fill')).toEqual(!!fill);
  });
});
