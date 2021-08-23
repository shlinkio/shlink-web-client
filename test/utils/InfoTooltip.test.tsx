import { shallow } from 'enzyme';
import { UncontrolledTooltip } from 'reactstrap';
import { InfoTooltip } from '../../src/utils/InfoTooltip';
import Popper from 'popper.js';

describe('<InfoTooltip />', () => {
  it.each([
    [ undefined ],
    [ 'foo' ],
    [ 'bar' ],
  ])('renders expected className on span', (className) => {
    const wrapper = shallow(<InfoTooltip placement="right" className={className} />);
    const span = wrapper.find('span');

    expect(span.prop('className')).toEqual(className ?? '');
  });

  it.each([
    [ <span key={1} /> ],
    [ 'Foo' ],
    [ 'Hello' ],
    [[ 'One', 'Two', <span key={3} /> ]],
  ])('passes children down to the nested tooltip component', (children) => {
    const wrapper = shallow(<InfoTooltip placement="right">{children}</InfoTooltip>);
    const tooltip = wrapper.find(UncontrolledTooltip);

    expect(tooltip.prop('children')).toEqual(children);
  });

  it.each([
    [ 'right' as Popper.Placement ],
    [ 'left' as Popper.Placement ],
    [ 'top' as Popper.Placement ],
    [ 'bottom' as Popper.Placement ],
  ])('places tooltip where requested', (placement) => {
    const wrapper = shallow(<InfoTooltip placement={placement} />);
    const tooltip = wrapper.find(UncontrolledTooltip);

    expect(tooltip.prop('placement')).toEqual(placement);
  });
});
