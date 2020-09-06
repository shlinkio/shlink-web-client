import React, { FC } from 'react';
import BooleanControl, { BooleanControlProps } from './BooleanControl';

const ToggleSwitch: FC<BooleanControlProps> = (props) => <BooleanControl type="switch" {...props} />;

export default ToggleSwitch;
