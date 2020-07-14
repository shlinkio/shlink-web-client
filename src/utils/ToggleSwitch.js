import React from 'react';
import BooleanControl, { basePropTypes } from './BooleanControl';

const ToggleSwitch = (props) => <BooleanControl type="switch" {...props} />;

ToggleSwitch.propTypes = basePropTypes;

export default ToggleSwitch;
