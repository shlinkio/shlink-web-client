import React from 'react';
import PropTypes from 'prop-types';
import Tag from '../tags/helpers/Tag';
import { colorGeneratorType } from '../utils/services/ColorGenerator';
import VisitsHeader from './VisitsHeader';
import { TagVisitsType } from './reducers/tagVisits';
import './ShortUrlVisitsHeader.scss';

const propTypes = {
  tagVisits: TagVisitsType.isRequired,
  goBack: PropTypes.func.isRequired,
  colorGenerator: colorGeneratorType,
};

const TagVisitsHeader = ({ tagVisits, goBack, colorGenerator }) => {
  const { visits, tag } = tagVisits;

  const visitsStatsTitle = (
    <span className="d-flex align-items-center justify-content-center">
      <span className="mr-2">Visits for</span>
      <Tag text={tag} colorGenerator={colorGenerator} />
    </span>
  );

  return <VisitsHeader title={visitsStatsTitle} goBack={goBack} visits={visits} />;
};

TagVisitsHeader.propTypes = propTypes;

export default TagVisitsHeader;
