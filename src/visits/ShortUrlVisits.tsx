import React, { FC, useEffect } from 'react';
import qs from 'qs';
import { RouteComponentProps } from 'react-router';
import { MercureBoundProps, useMercureTopicBinding } from '../mercure/helpers';
import { ShlinkVisitsParams } from '../utils/services/types';
import { ShortUrlVisits as ShortUrlVisitsState } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import { ShortUrlDetail } from './reducers/shortUrlDetail';

export interface ShortUrlVisitsProps extends RouteComponentProps<{ shortCode: string }>, MercureBoundProps {
  getShortUrlVisits: (shortCode: string, query?: ShlinkVisitsParams) => void;
  shortUrlVisits: ShortUrlVisitsState;
  getShortUrlDetail: Function;
  shortUrlDetail: ShortUrlDetail;
  cancelGetShortUrlVisits: Function;
}

const ShortUrlVisits = (VisitsStats: FC<any>) => ({ // TODO Use VisitsStatsProps once available
  history: { goBack },
  match,
  location: { search },
  shortUrlVisits,
  shortUrlDetail,
  getShortUrlVisits,
  getShortUrlDetail,
  cancelGetShortUrlVisits,
  createNewVisit,
  loadMercureInfo,
  mercureInfo,
}: ShortUrlVisitsProps) => {
  const { params } = match;
  const { shortCode } = params;
  const { domain } = qs.parse(search, { ignoreQueryPrefix: true }) as { domain?: string };

  const loadVisits = (dates: Partial<ShlinkVisitsParams>) => getShortUrlVisits(shortCode, { ...dates, domain });

  useEffect(() => {
    getShortUrlDetail(shortCode, domain);
  }, []);
  useMercureTopicBinding(mercureInfo, `https://shlink.io/new-visit/${shortCode}`, createNewVisit, loadMercureInfo);

  return (
    <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetShortUrlVisits} visitsInfo={shortUrlVisits}>
      <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={goBack} />
    </VisitsStats>
  );
};

export default ShortUrlVisits;
