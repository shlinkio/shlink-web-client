import { ReactNode } from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import { ChartCard } from '../../../src/visits/charts/ChartCard';

describe('<ChartCard />', () => {
  let wrapper: ShallowWrapper;
  const createWrapper = (title: Function | string = '', footer?: ReactNode) => {
    wrapper = shallow(<ChartCard title={title} footer={footer} />);

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders expected components', () => {
    const wrapper = createWrapper();
    const card = wrapper.find(Card);
    const header = wrapper.find(CardHeader);
    const body = wrapper.find(CardBody);
    const footer = wrapper.find(CardFooter);

    expect(card).toHaveLength(1);
    expect(header).toHaveLength(1);
    expect(body).toHaveLength(1);
    expect(footer).toHaveLength(0);
  });

  it.each([
    ['the title', 'the title'],
    [() => 'the title from func', 'the title from func'],
  ])('properly renders title by parsing provided value', (title, expectedTitle) => {
    const wrapper = createWrapper(title);
    const header = wrapper.find(CardHeader);

    expect(header.html()).toContain(expectedTitle);
  });

  it('renders footer only when provided', () => {
    const wrapper = createWrapper('', 'the footer');
    const footer = wrapper.find(CardFooter);

    expect(footer).toHaveLength(1);
    expect(footer.html()).toContain('the footer');
  });
});
