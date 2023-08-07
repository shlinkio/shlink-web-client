import { screen } from '@testing-library/react';
import { fromPartial } from '@total-typescript/shoehorn';
import { MemoryRouter } from 'react-router-dom';
import type { ShlinkShortUrl } from '../../../src/api-contract';
import { ExportShortUrlsBtn as createExportShortUrlsBtn } from '../../../src/short-urls/helpers/ExportShortUrlsBtn';
import type { ReportExporter } from '../../../src/utils/services/ReportExporter';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<ExportShortUrlsBtn />', () => {
  const listShortUrls = vi.fn();
  const buildShlinkApiClient = vi.fn().mockReturnValue({ listShortUrls });
  const exportShortUrls = vi.fn();
  const reportExporter = fromPartial<ReportExporter>({ exportShortUrls });
  const ExportShortUrlsBtn = createExportShortUrlsBtn(buildShlinkApiClient, reportExporter);
  const setUp = (amount?: number) => renderWithEvents(
    <MemoryRouter>
      <ExportShortUrlsBtn amount={amount} />
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
    [10, 1],
    [30, 2],
    [39, 2],
    [40, 2],
    [41, 3],
    [385, 20],
  ])('loads proper amount of pages based on the amount of results', async (amount, expectedPageLoads) => {
    listShortUrls.mockResolvedValue({ data: [] });
    const { user } = setUp(amount);

    await user.click(screen.getByRole('button'));

    expect(listShortUrls).toHaveBeenCalledTimes(expectedPageLoads);
    expect(exportShortUrls).toHaveBeenCalled();
  });

  it('maps short URLs for exporting', async () => {
    listShortUrls.mockResolvedValue({
      data: [fromPartial<ShlinkShortUrl>({
        shortUrl: 'https://s.test/short-code',
        tags: [],
      })],
    });
    const { user } = setUp();

    await user.click(screen.getByRole('button'));

    expect(exportShortUrls).toHaveBeenCalledWith([expect.objectContaining({
      shortUrl: 'https://s.test/short-code',
      domain: 's.test',
      shortCode: 'short-code',
    })]);
  });
});
