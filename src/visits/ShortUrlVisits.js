import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { MercureInfoType } from '../mercure/reducers/mercureInfo';
import { bindToMercureTopic } from '../mercure/helpers';
import { SettingsType } from '../settings/reducers/settings';
import { shortUrlVisitsType } from './reducers/shortUrlVisits';
import VisitsHeader from './VisitsHeader';
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
  settings: SettingsType,
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
    settings: { realTimeUpdates },
  }) => {
    const { params } = match;
    const { shortCode } = params;
    const { search } = location;
    const { domain } = qs.parse(search, { ignoreQueryPrefix: true });

    const loadVisits = (dates) => getShortUrlVisits(shortCode, { ...dates, domain });

    useEffect(() => {
      getShortUrlDetail(shortCode, domain);
    }, []);
    useEffect(
      bindToMercureTopic(
        mercureInfo,
        realTimeUpdates,
        `https://shlink.io/new-visit/${shortCode}`,
        createNewVisit,
        loadMercureInfo
      ),
      [ mercureInfo ],
    );

    return (
      <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetShortUrlVisits} visitsInfo={shortUrlVisits}>
        <VisitsHeader shortUrlDetail={shortUrlDetail} shortUrlVisits={shortUrlVisits} goBack={history.goBack} />
      </VisitsStats>
    );
  };

  ShortUrlVisitsComp.propTypes = propTypes;

  return ShortUrlVisitsComp;
};

export default ShortUrlVisits;
