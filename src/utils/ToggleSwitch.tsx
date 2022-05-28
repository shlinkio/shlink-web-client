import { FC } from 'react';
import BooleanControl, { BooleanControlProps } from './BooleanControl';

export const ToggleSwitch: FC<BooleanControlProps> = (props) => <BooleanControl type="switch" {...props} />;
