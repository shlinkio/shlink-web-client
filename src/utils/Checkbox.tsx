import { FC } from 'react';
import BooleanControl, { BooleanControlProps } from './BooleanControl';

export const Checkbox: FC<BooleanControlProps> = (props) => <BooleanControl type="checkbox" {...props} />;
