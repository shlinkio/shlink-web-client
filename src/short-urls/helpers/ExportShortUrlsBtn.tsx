import { FC } from 'react';
import { ExportBtn } from '../../utils/ExportBtn';
import { useToggle } from '../../utils/helpers/hooks';
import { ShlinkApiClientBuilder } from '../../api/services/ShlinkApiClientBuilder';
import { isServerWithId, SelectedServer } from '../../servers/data';
import { ShortUrl } from '../data';
import { ReportExporter } from '../../common/services/ReportExporter';
import { useShortUrlsQuery } from './hooks';

export interface ExportShortUrlsBtnProps {
  amount?: number;
}

interface ExportShortUrlsBtnConnectProps extends ExportShortUrlsBtnProps {
  selectedServer: SelectedServer;
}

const itemsPerPage = 20;

export const ExportShortUrlsBtn = (
  buildShlinkApiClient: ShlinkApiClientBuilder,
  { exportShortUrls }: ReportExporter,
): FC<ExportShortUrlsBtnConnectProps> => ({ amount = 0, selectedServer }) => {
  const [{ tags, search, startDate, endDate, orderBy, tagsMode }] = useShortUrlsQuery();
  const [loading,, startLoading, stopLoading] = useToggle();
  const exportAllUrls = async () => {
    if (!isServerWithId(selectedServer)) {
      return;
    }

    const totalPages = amount / itemsPerPage;
    const { listShortUrls } = buildShlinkApiClient(selectedServer);
    const loadAllUrls = async (page = 1): Promise<ShortUrl[]> => {
      const { data } = await listShortUrls(
        { page: `${page}`, tags, searchTerm: search, startDate, endDate, orderBy, tagsMode, itemsPerPage },
      );

      if (page >= totalPages) {
        return data;
      }

      // TODO Support paralelization
      return data.concat(await loadAllUrls(page + 1));
    };

    startLoading();
    const shortUrls = await loadAllUrls();

    exportShortUrls(shortUrls.map((shortUrl) => ({
      createdAt: shortUrl.dateCreated,
      shortUrl: shortUrl.shortUrl,
      longUrl: shortUrl.longUrl,
      title: shortUrl.title ?? '',
      tags: shortUrl.tags.join(','),
      visits: shortUrl.visitsCount,
    })));
    stopLoading();
  };

  return <ExportBtn loading={loading} className="btn-md-block" amount={amount} onClick={exportAllUrls} />;
};
