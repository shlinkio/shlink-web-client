import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MercureInfoType } from '../mercure/reducers/mercureInfo';
import { SettingsType } from '../settings/reducers/settings';
import { bindToMercureTopic } from '../mercure/helpers';
import { TagVisitsType } from './reducers/tagVisits';
import TagVisitsHeader from './TagVisitsHeader';

const propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  getTagVisits: PropTypes.func,
  tagVisits: TagVisitsType,
  cancelGetTagVisits: PropTypes.func,
  createNewVisit: PropTypes.func,
  loadMercureInfo: PropTypes.func,
  mercureInfo: MercureInfoType,
  settings: SettingsType,
};

const TagVisits = (VisitsStats) => {
  const TagVisitsComp = ({
    history,
    match,
    getTagVisits,
    tagVisits,
    cancelGetTagVisits,
    createNewVisit,
    loadMercureInfo,
    mercureInfo,
    settings: { realTimeUpdates },
  }) => {
    const { params } = match;
    const { tag } = params;
    const loadVisits = (dates) => getTagVisits(tag, dates);

    useEffect(
      bindToMercureTopic(
        mercureInfo,
        realTimeUpdates,
        'https://shlink.io/new-visit',
        createNewVisit,
        loadMercureInfo
      ),
      [ mercureInfo ],
    );

    return (
      <VisitsStats getVisits={loadVisits} cancelGetVisits={cancelGetTagVisits} visitsInfo={tagVisits}>
        <TagVisitsHeader tagVisits={tagVisits} goBack={history.goBack} />
      </VisitsStats>
    );
  };

  TagVisitsComp.propTypes = propTypes;

  return TagVisitsComp;
};

export default TagVisits;
