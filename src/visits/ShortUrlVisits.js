import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { MercureInfoType } from '../mercure/reducers/mercureInfo';
import { useMercureTopicBinding } from '../mercure/helpers';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import ShortUrlVisitsHeader from './ShortUrlVisitsHeader';
import { shortUrlDetailType } from './reducers/shortUrlDetail';

const propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  getShortUrlVisits: PropTypes.func,
  shortUrlVisits: shortUrlVisitsType,
  getShortUrlDetail: PropTypes.func,
  shortUrlDetail: shortUrlDetailType,
  cancelGetShortUrlVisits: PropTypes.func,
  createNewVisit: PropTypes.func,
  loadMercureInfo: PropTypes.func,
  mercureInfo: MercureInfoType,
};

const ShortUrlVisits = (VisitsStats) => {
  const ShortUrlVisitsComp = ({
    history,
    match,
    location,
    shortUrlVisits,
    shortUrlDetail,
    getShortUrlVisits,
    getShortUrlDetail,
    cancelGetShortUrlVisits,
    createNewVisit,
    loadMercureInfo,
    mercureInfo,
  }) => {
    const { params } = match;
    const { shortCode } = params;
    const { search } = location;
    const { domain } = qs.parse(search, { ignoreQueryPrefix: true });

    const loadVisits = (dates) => getShortUrlVisits(shortCode, { ...dates, domain });

    useEffect(() => {
      getShortUrlDetail(shortCode, domain);
    }, []);
    useMercureTopicBinding(mercureInfo, `https://shlink.io/new-visit/${shortCode}`, createNewVisit, loadMercureInfo);

    return (
      <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetShortUrlVisits} visitsInfo={shortUrlVisits}>
        <ShortUrlVisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={history.goBack} />
      </VisitsStats>
    );
  };

  ShortUrlVisitsComp.propTypes = propTypes;

  return ShortUrlVisitsComp;
};

export default ShortUrlVisits;
