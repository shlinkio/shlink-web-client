import { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../api/types';
import { parseQuery } from '../utils/helpers/query';
import { Topics } from '../mercure/helpers/Topics';
import { ShortUrlDetail } from '../short-urls/reducers/shortUrlDetail';
import { Settings } from '../settings/reducers/settings';
import { ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import VisitsStats from './VisitsStats';

export interface ShortUrlVisitsProps extends RouteComponentProps<{ shortCode: string }> {
  getShortUrlVisits: (shortCode: string, query?: ShlinkVisitsParams) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: Function;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: () => void;
  settings: Settings;
}

const ShortUrlVisits = boundToMercureHub(({
  history: { goBack },
  match: { params, url },
  location: { search },
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
  settings,
}: ShortUrlVisitsProps) => {
  const { shortCode } = params;
  const { domain } = parseQuery<{ domain?: string }>(search);
  const loadVisits = (params: Partial<ShlinkVisitsParams>) => getShortUrlVisits(shortCode, { ...params, domain });

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
    >
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
}, ({ match }) => [ Topics.shortUrlVisits(match.params.shortCode) ]);

export default ShortUrlVisits;
