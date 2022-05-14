import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { parseQuery } from '../utils/helpers/query';
import { Topics } from '../mercure/helpers/Topics';
import { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import { useGoBack } from '../utils/helpers/hooks';
import { ReportExporter } from '../common/services/ReportExporter';
import { ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import VisitsStats from './VisitsStats';
import { NormalizedVisit, VisitsParams } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface ShortUrlVisitsProps extends CommonVisitsProps {
  getShortUrlVisits: (shortCode: string, query?: ShlinkVisitsParams, doIntervalFallback?: boolean) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: Function;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: () => void;
}

const ShortUrlVisits = ({ exportVisits }: ReportExporter) => boundToMercureHub(({
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
  settings,
  selectedServer,
}: ShortUrlVisitsProps) => {
  const { shortCode = '' } = useParams<{ shortCode: string }>();
  const { search } = useLocation();
  const goBack = useGoBack();
  const { domain } = parseQuery<{ domain?: string }>(search);
  const loadVisits = (params: VisitsParams, doIntervalFallback?: boolean) =>
    getShortUrlVisits(shortCode, { ...toApiParams(params), domain }, doIntervalFallback);
  const exportCsv = (visits: NormalizedVisit[]) => exportVisits(
    `short-url_${shortUrlDetail.shortUrl?.shortUrl.replace(/https?:\/\//g, '')}_visits.csv`,
    visits,
  );

  useEffect(() => {
    getShortUrlDetail(shortCode, domain);
  }, []);

  return (
    <VisitsStats
      getVisits={loadVisits}
      cancelGetVisits={cancelGetShortUrlVisits}
      visitsInfo={shortUrlVisits}
      domain={domain}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
}, (_, params) => [Topics.shortUrlVisits(params.shortCode)]);

export default ShortUrlVisits;
