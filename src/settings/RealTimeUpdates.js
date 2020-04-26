import React from 'react';
import { Card, CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Checkbox from '../utils/Checkbox';
import { SettingsType } from './reducers/settings';

const propTypes = {
  settings: SettingsType,
  setRealTimeUpdates: PropTypes.func,
};

const RealTimeUpdates = ({ settings: { realTimeUpdates }, setRealTimeUpdates }) => (
  <Card>
    <CardHeader>Real-time updates</CardHeader>
    <CardBody>
      <Checkbox checked={realTimeUpdates.enabled} onChange={setRealTimeUpdates}>
        Enable real-time updates
        <FontAwesomeIcon icon={faInfoCircle} className="ml-2" id="realTimeUpdatesInfo" />
      </Checkbox>
      <UncontrolledTooltip target="realTimeUpdatesInfo">
        Enable or disable real-time updates, when using Shlink v2.2.0 or newer.
      </UncontrolledTooltip>
    </CardBody>
  </Card>
);

RealTimeUpdates.propTypes = propTypes;

export default RealTimeUpdates;
