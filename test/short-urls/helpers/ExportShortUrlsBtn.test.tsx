import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { ReportExporter } from '../../../src/common/services/ReportExporter';
import type { NotFoundServer, SelectedServer } from '../../../src/servers/data';
import type { ShortUrl } from '../../../src/shlink-web-component/short-urls/data';
import { ExportShortUrlsBtn as createExportShortUrlsBtn } from '../../../src/shlink-web-component/short-urls/helpers/ExportShortUrlsBtn';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ExportShortUrlsBtn />', () => {
  const listShortUrls = vi.fn();
  const buildShlinkApiClient = vi.fn().mockReturnValue({ listShortUrls });
  const exportShortUrls = vi.fn();
  const reportExporter = fromPartial<ReportExporter>({ exportShortUrls });
  const ExportShortUrlsBtn = createExportShortUrlsBtn(buildShlinkApiClient, reportExporter);
  const setUp = (amount?: number, selectedServer?: SelectedServer) => renderWithEvents(
    <MemoryRouter>
      <ExportShortUrlsBtn selectedServer={selectedServer ?? fromPartial({})} amount={amount} />
    </MemoryRouter>,
  );

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
    [fromPartial<NotFoundServer>({})],
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
    const { user } = setUp(amount, fromPartial({ id: '123' }));

    await user.click(screen.getByRole('button'));

    expect(listShortUrls).toHaveBeenCalledTimes(expectedPageLoads);
    expect(exportShortUrls).toHaveBeenCalled();
  });

  it('maps short URLs for exporting', async () => {
    listShortUrls.mockResolvedValue({
      data: [fromPartial<ShortUrl>({
        shortUrl: 'https://s.test/short-code',
        tags: [],
      })],
    });
    const { user } = setUp(undefined, fromPartial({ id: '123' }));

    await user.click(screen.getByRole('button'));

    expect(exportShortUrls).toHaveBeenCalledWith([expect.objectContaining({
      shortUrl: 'https://s.test/short-code',
      domain: 's.test',
      shortCode: 'short-code',
    })]);
  });
});
