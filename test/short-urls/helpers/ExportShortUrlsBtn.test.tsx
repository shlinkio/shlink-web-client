import { Mock } from 'ts-mockery';
import { shallow, ShallowWrapper } from 'enzyme';
import { ReportExporter } from '../../../src/common/services/ReportExporter';
import { ExportShortUrlsBtn as createExportShortUrlsBtn } from '../../../src/short-urls/helpers/ExportShortUrlsBtn';
import { NotFoundServer, ReachableServer, SelectedServer } from '../../../src/servers/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
  useParams: jest.fn().mockReturnValue({}),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('<ExportShortUrlsBtn />', () => {
  const listShortUrls = jest.fn();
  const buildShlinkApiClient = jest.fn().mockReturnValue({ listShortUrls });
  const exportShortUrls = jest.fn();
  const reportExporter = Mock.of<ReportExporter>({ exportShortUrls });
  const ExportShortUrlsBtn = createExportShortUrlsBtn(buildShlinkApiClient, reportExporter);
  let wrapper: ShallowWrapper;
  const createWrapper = (amount?: number, selectedServer?: SelectedServer) => {
    wrapper = shallow(
      <ExportShortUrlsBtn selectedServer={selectedServer ?? Mock.all<SelectedServer>()} amount={amount} />,
    );

    return wrapper;
  };

  afterEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it.each([
    [undefined, 0],
    [1, 1],
    [4578, 4578],
  ])('renders expected amount', (amount, expectedAmount) => {
    const wrapper = createWrapper(amount);

    expect(wrapper.prop('amount')).toEqual(expectedAmount);
  });

  it.each([
    [null],
    [Mock.of<NotFoundServer>()],
  ])('does nothing on click if selected server is not reachable', (selectedServer) => {
    const wrapper = createWrapper(0, selectedServer);

    wrapper.simulate('click');
    expect(listShortUrls).not.toHaveBeenCalled();
    expect(exportShortUrls).not.toHaveBeenCalled();
  });

  it.each([
    [10, 1],
    [30, 2],
    [39, 2],
    [40, 2],
    [41, 3],
    [385, 20],
  ])('loads proper amount of pages based on the amount of results', async (amount, expectedPageLoads) => {
    const wrapper = createWrapper(amount, Mock.of<ReachableServer>({ id: '123' }));

    listShortUrls.mockResolvedValue({ data: [] });

    await (wrapper.prop('onClick') as Function)();

    expect(listShortUrls).toHaveBeenCalledTimes(expectedPageLoads);
    expect(exportShortUrls).toHaveBeenCalledTimes(1);
  });
});
