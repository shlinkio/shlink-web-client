import type { FC } from 'react';
import type { BooleanControlProps } from './BooleanControl';
import { BooleanControl } from './BooleanControl';

export const ToggleSwitch: FC<BooleanControlProps> = (props) => <BooleanControl type="switch" {...props} />;
