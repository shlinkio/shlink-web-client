import React, { useEffect } from 'react';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';
import { boundToMercureHub } from '../mercure/helpers/boundToMercureHub';
import { ShlinkVisitsParams } from '../utils/services/types';
import { ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import { ShortUrlDetail } from './reducers/shortUrlDetail';
import VisitsStats from './VisitsStats';

export interface ShortUrlVisitsProps extends RouteComponentProps<{ shortCode: string }> {
  getShortUrlVisits: (shortCode: string, query?: ShlinkVisitsParams) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: Function;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: () => void;
}

const ShortUrlVisits = boundToMercureHub(({
  history: { goBack },
  match,
  location: { search },
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
}: ShortUrlVisitsProps) => {
  const { params } = match;
  const { shortCode } = params;
  const { domain } = qs.parse(search, { ignoreQueryPrefix: true }) as { domain?: string };

  const loadVisits = (params: Partial<ShlinkVisitsParams>) => getShortUrlVisits(shortCode, { ...params, domain });

  useEffect(() => {
    getShortUrlDetail(shortCode, domain);
  }, []);

  return (
    <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetShortUrlVisits} visitsInfo={shortUrlVisits}>
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
}, ({ match }) => `https://shlink.io/new-visit/${match.params.shortCode}`);

export default ShortUrlVisits;
