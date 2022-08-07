import { Mock } from 'ts-mockery';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReportExporter } from '../../../src/common/services/ReportExporter';
import { ExportShortUrlsBtn as createExportShortUrlsBtn } from '../../../src/short-urls/helpers/ExportShortUrlsBtn';
import { NotFoundServer, ReachableServer, SelectedServer } from '../../../src/servers/data';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ExportShortUrlsBtn />', () => {
  const listShortUrls = jest.fn();
  const buildShlinkApiClient = jest.fn().mockReturnValue({ listShortUrls });
  const exportShortUrls = jest.fn();
  const reportExporter = Mock.of<ReportExporter>({ exportShortUrls });
  const ExportShortUrlsBtn = createExportShortUrlsBtn(buildShlinkApiClient, reportExporter);
  const setUp = (amount?: number, selectedServer?: SelectedServer) => renderWithEvents(
    <MemoryRouter>
      <ExportShortUrlsBtn selectedServer={selectedServer ?? Mock.all<SelectedServer>()} amount={amount} />
    </MemoryRouter>,
  );

  afterEach(jest.clearAllMocks);

  it.each([
    [undefined, '0'],
    [1, '1'],
    [4578, '4,578'],
  ])('renders expected amount', (amount, expectedAmount) => {
    setUp(amount);
    expect(screen.getByText(/Export/)).toHaveTextContent(`Export (${expectedAmount})`);
  });

  it.each([
    [null],
    [Mock.of<NotFoundServer>()],
  ])('does nothing on click if selected server is not reachable', async (selectedServer) => {
    const { user } = setUp(0, selectedServer);

    await user.click(screen.getByRole('button'));
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
    listShortUrls.mockResolvedValue({ data: [] });
    const { user } = setUp(amount, Mock.of<ReachableServer>({ id: '123' }));

    await user.click(screen.getByRole('button'));
    await waitForElementToBeRemoved(() => screen.getByText('Exporting...'));

    expect(listShortUrls).toHaveBeenCalledTimes(expectedPageLoads);
    expect(exportShortUrls).toHaveBeenCalled();
  });
});
