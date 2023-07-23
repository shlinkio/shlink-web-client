import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type { ReportExporter } from '../../common/services/ReportExporter';
import { useGoBack } from '../../utils/helpers/hooks';
import { parseQuery } from '../../utils/helpers/query';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { Topics } from '../mercure/helpers/Topics';
import type { ShortUrlIdentifier } from '../short-urls/data';
import { urlDecodeShortCode } from '../short-urls/helpers';
import type { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import type { LoadShortUrlVisits, ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import { ShortUrlVisitsHeader } from './ShortUrlVisitsHeader';
import type { NormalizedVisit, VisitsParams } from './types';
import { toApiParams } from './types/helpers';
import { VisitsStats } from './VisitsStats';

export interface ShortUrlVisitsProps {
  getShortUrlVisits: (params: LoadShortUrlVisits) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: (shortUrl: ShortUrlIdentifier) => void;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: () => void;
}

export const ShortUrlVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
}: ShortUrlVisitsProps) => {
  const { shortCode = '' } = useParams<{ shortCode: string }>();
  const { search } = useLocation();
  const goBack = useGoBack();
  const { domain } = parseQuery<{ domain?: string }>(search);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) => getShortUrlVisits({
    shortCode: urlDecodeShortCode(shortCode),
    query: { ...toApiParams(params), domain },
    doIntervalFallback,
  });
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(
    `short-url_${shortUrlDetail.shortUrl?.shortUrl.replace(/https?:\/\//g, '')}_visits.csv`,
    visits,
  );

  useEffect(() => {
    getShortUrlDetail({ shortCode: urlDecodeShortCode(shortCode), domain });
  }, []);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetShortUrlVisits}
      visitsInfo={shortUrlVisits}
      exportCsv={exportCsv}
    >
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
}, (_, params) => (params.shortCode ? [Topics.shortUrlVisits(urlDecodeShortCode(params.shortCode))] : []));
