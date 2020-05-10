import React from 'react';
import PropTypes from 'prop-types';
import VisitsHeader from './VisitsHeader';
import { TagVisitsType } from './reducers/tagVisits';
import './ShortUrlVisitsHeader.scss';

const propTypes = {
  tagVisits: TagVisitsType.isRequired,
  goBack: PropTypes.func.isRequired,
};

const TagVisitsHeader = ({ tagVisits, goBack }) => {
  const { visits, tag } = tagVisits;

  const visitsStatsTitle = (
    <React.Fragment>
      Visits for {tag}
    </React.Fragment>
  );

  return <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} />;
};

TagVisitsHeader.propTypes = propTypes;

export default TagVisitsHeader;
