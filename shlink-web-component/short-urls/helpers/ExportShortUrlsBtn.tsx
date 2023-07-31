import type { FC } from 'react';
import { useCallback } from 'react';
import { useToggle } from '../../../shlink-frontend-kit/src';
import type { ShlinkApiClient } from '../../api-contract';
import { ExportBtn } from '../../utils/components/ExportBtn';
import type { ReportExporter } from '../../utils/services/ReportExporter';
import type { ShortUrl } from '../data';
import { useShortUrlsQuery } from './hooks';

export interface ExportShortUrlsBtnProps {
  amount?: number;
}

const itemsPerPage = 20;

export const ExportShortUrlsBtn = (
  apiClientFactory: () => ShlinkApiClient,
  { exportShortUrls }: ReportExporter,
): FC<ExportShortUrlsBtnProps> => ({ amount = 0 }) => {
  const [{ tags, search, startDate, endDate, orderBy, tagsMode }] = useShortUrlsQuery();
  const [loading,, startLoading, stopLoading] = useToggle();
  const exportAllUrls = useCallback(async () => {
    const totalPages = amount / itemsPerPage;
    const loadAllUrls = async (page = 1): Promise<ShortUrl[]> => {
      const { data } = await apiClientFactory().listShortUrls(
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
