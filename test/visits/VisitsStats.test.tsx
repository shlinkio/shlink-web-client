import { shallow, ShallowWrapper } from 'enzyme';
import { Button, Progress } from 'reactstrap';
import { Mock } from 'ts-mockery';
import VisitStats from '../../src/visits/VisitsStats';
import Message from '../../src/utils/Message';
import GraphCard from '../../src/visits/helpers/GraphCard';
import SortableBarGraph from '../../src/visits/helpers/SortableBarGraph';
import { Visit, VisitsInfo } from '../../src/visits/types';
import LineChartCard from '../../src/visits/helpers/LineChartCard';
import VisitsTable from '../../src/visits/VisitsTable';
import { Result } from '../../src/utils/Result';
import { Settings } from '../../src/settings/reducers/settings';
import { SelectedServer } from '../../src/servers/data';

describe('<VisitStats />', () => {
  const visits = [ Mock.all<Visit>(), Mock.all<Visit>(), Mock.all<Visit>() ];

  let wrapper: ShallowWrapper;
  const getVisitsMock = jest.fn();
  const exportCsv = jest.fn();

  const createComponent = (visitsInfo: Partial<VisitsInfo>) => {
    wrapper = shallow(
      <VisitStats
        getVisits={getVisitsMock}
        visitsInfo={Mock.of<VisitsInfo>(visitsInfo)}
        cancelGetVisits={() => {}}
        baseUrl={''}
        settings={Mock.all<Settings>()}
        exportCsv={exportCsv}
        selectedServer={Mock.all<SelectedServer>()}
      />,
    );

    return wrapper;
  };

  afterEach(() => wrapper?.unmount());

  it('renders a preloader when visits are loading', () => {
    const wrapper = createComponent({ loading: true, visits: [] });
    const loadingMessage = wrapper.find(Message);
    const progress = wrapper.find(Progress);

    expect(loadingMessage).toHaveLength(1);
    expect(loadingMessage.html()).toContain('Loading...');
    expect(progress).toHaveLength(0);
  });

  it('renders a warning and progress bar when loading large amounts of visits', () => {
    const wrapper = createComponent({ loading: true, loadingLarge: true, visits: [], progress: 25 });
    const loadingMessage = wrapper.find(Message);
    const progress = wrapper.find(Progress);

    expect(loadingMessage).toHaveLength(1);
    expect(loadingMessage.html()).toContain('This is going to take a while... :S');
    expect(progress).toHaveLength(1);
    expect(progress.prop('value')).toEqual(25);
  });

  it('renders an error message when visits could not be loaded', () => {
    const wrapper = createComponent({ loading: false, error: true, visits: [] });
    const errorMessage = wrapper.find(Result).filterWhere((result) => result.prop('type') === 'error');

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.html()).toContain('An error occurred while loading visits :(');
  });

  it('renders a message when visits are loaded but the list is empty', () => {
    const wrapper = createComponent({ loading: false, error: false, visits: [] });
    const message = wrapper.find(Message);

    expect(message).toHaveLength(1);
    expect(message.html()).toContain('There are no visits matching current filter  :(');
  });

  it('renders expected amount of graphics', () => {
    const wrapper = createComponent({ loading: false, error: false, visits });
    const graphs = wrapper.find(GraphCard);
    const sortableBarGraphs = wrapper.find(SortableBarGraph);
    const lineChart = wrapper.find(LineChartCard);
    const table = wrapper.find(VisitsTable);

    expect(graphs.length + sortableBarGraphs.length + lineChart.length).toEqual(6);
    expect(table).toHaveLength(1);
  });

  it('holds the map button content generator on cities graph extraHeaderContent', () => {
    const wrapper = createComponent({ loading: false, error: false, visits });
    const citiesGraph = wrapper.find(SortableBarGraph).find('[title="Cities"]');
    const extraHeaderContent = citiesGraph.prop('extraHeaderContent');

    expect(extraHeaderContent).toHaveLength(1);
    expect(typeof extraHeaderContent).toEqual('function');
  });

  it('exports CSV when export btn is clicked', () => {
    const wrapper = createComponent({ visits });
    const exportBtn = wrapper.find(Button).last();

    expect(exportBtn).toHaveLength(1);
    exportBtn.simulate('click');
    expect(exportCsv).toHaveBeenCalled();
  });
});
