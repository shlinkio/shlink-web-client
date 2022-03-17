import { shallow, ShallowWrapper } from 'enzyme';
import { Doughnut } from 'react-chartjs-2';
import { keys, values } from 'ramda';
import { DoughnutChart } from '../../../src/visits/charts/DoughnutChart';

describe('<DoughnutChart />', () => {
  let wrapper: ShallowWrapper;
  const stats = {
    foo: 123,
    bar: 456,
  };

  afterEach(() => wrapper?.unmount());

  it('renders Doughnut with expected props', () => {
    wrapper = shallow(<DoughnutChart stats={stats} />);
    const doughnut = wrapper.find(Doughnut);
    const cols = wrapper.find('.col-sm-12');

    expect(doughnut).toHaveLength(1);

    const { labels, datasets } = doughnut.prop('data') as any;
    const [{ data, backgroundColor, borderColor }] = datasets;
    const { plugins, scales } = (doughnut.prop('options') ?? {}) as any;

    expect(labels).toEqual(keys(stats));
    expect(data).toEqual(values(stats));
    expect(datasets).toHaveLength(1);
    expect(backgroundColor).toEqual([
      '#97BBCD',
      '#F7464A',
      '#46BFBD',
      '#FDB45C',
      '#949FB1',
      '#57A773',
      '#414066',
      '#08B2E3',
      '#B6C454',
      '#DCDCDC',
      '#463730',
    ]);
    expect(borderColor).toEqual('white');
    expect(plugins.legend).toEqual({ display: false });
    expect(scales).toBeUndefined();
    expect(cols).toHaveLength(2);
  });
});
