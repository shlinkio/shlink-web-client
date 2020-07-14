import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import ToggleSwitch from '../utils/ToggleSwitch';
import { SettingsType } from './reducers/settings';

const propTypes = {
  settings: SettingsType,
  setRealTimeUpdates: PropTypes.func,
};

const RealTimeUpdates = ({ settings: { realTimeUpdates }, setRealTimeUpdates }) => (
  <Card>
    <CardHeader>Real-time updates</CardHeader>
    <CardBody>
      <ToggleSwitch checked={realTimeUpdates.enabled} onChange={setRealTimeUpdates}>
        Enable or disable real-time updates, when using Shlink v2.2.0 or newer.
      </ToggleSwitch>
    </CardBody>
  </Card>
);

RealTimeUpdates.propTypes = propTypes;

export default RealTimeUpdates;
