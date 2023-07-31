import type { FC } from 'react';
import type { BooleanControlProps } from './BooleanControl';
import { BooleanControl } from './BooleanControl';

export const Checkbox: FC<BooleanControlProps> = (props) => <BooleanControl type="checkbox" {...props} />;
