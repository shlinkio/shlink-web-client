import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { parseQuery } from '../utils/helpers/query';
import { Topics } from '../mercure/helpers/Topics';
import { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import { ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import VisitsStats from './VisitsStats';
import { VisitsExporter } from './services/VisitsExporter';
import { NormalizedVisit, VisitsParams } from './types';
import { CommonVisitsProps } from './types/CommonVisitsProps';
import { toApiParams } from './types/helpers';

export interface ShortUrlVisitsProps extends CommonVisitsProps, RouteComponentProps<{ shortCode: string }> {
  getShortUrlVisits: (shortCode: string, query?: ShlinkVisitsParams) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: Function;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: () => void;
}

const ShortUrlVisits = ({ exportVisits }: VisitsExporter) => boundToMercureHub(({
  history: { goBack },
  match: { params, url },
  location: { search },
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
  settings,
  selectedServer,
}: ShortUrlVisitsProps) => {
  const { shortCode } = params;
  const { domain } = parseQuery<{ domain?: string }>(search);
  const loadVisits = (params: VisitsParams) => getShortUrlVisits(shortCode, { ...toApiParams(params), domain });
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
      baseUrl={url}
      domain={domain}
      settings={settings}
      exportCsv={exportCsv}
      selectedServer={selectedServer}
    >
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
}, ({ match }) => [ Topics.shortUrlVisits(match.params.shortCode) ]);

export default ShortUrlVisits;
