import type { FC } from 'react';
import { useCallback } from 'react';
import type { ReportExporter } from '../../../src/common/services/ReportExporter';
import { ExportBtn } from '../../../src/utils/ExportBtn';
import { useToggle } from '../../../src/utils/helpers/hooks';
import type { ShlinkApiClient } from '../../api-contract';
import type { ShortUrl } from '../data';
import { useShortUrlsQuery } from './hooks';

export interface ExportShortUrlsBtnProps {
  amount?: number;
}

const itemsPerPage = 20;

export const ExportShortUrlsBtn = (
  apiClient: ShlinkApiClient,
  { exportShortUrls }: ReportExporter,
): FC<ExportShortUrlsBtnProps> => ({ amount = 0 }) => {
  const [{ tags, search, startDate, endDate, orderBy, tagsMode }] = useShortUrlsQuery();
  const [loading,, startLoading, stopLoading] = useToggle();
  const exportAllUrls = useCallback(async () => {
    const totalPages = amount / itemsPerPage;
    const loadAllUrls = async (page = 1): Promise<ShortUrl[]> => {
      const { data } = await apiClient.listShortUrls(
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

    exportShortUrls(shortUrls.map((shortUrl) => {
      const { hostname: domain, pathname } = new URL(shortUrl.shortUrl);
      const shortCode = pathname.substring(1); // Remove trailing slash

      return {
        createdAt: shortUrl.dateCreated,
        domain,
        shortCode,
        shortUrl: shortUrl.shortUrl,
        longUrl: shortUrl.longUrl,
        title: shortUrl.title ?? '',
        tags: shortUrl.tags.join('|'),
        visits: shortUrl?.visitsSummary?.total ?? shortUrl.visitsCount,
      };
    }));
    stopLoading();
  }, []);

  return <ExportBtn loading={loading} className="btn-md-block" amount={amount} onClick={exportAllUrls} />;
};
