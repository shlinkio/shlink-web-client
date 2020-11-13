import { FC } from 'react';
import BooleanControl, { BooleanControlProps } from './BooleanControl';

const Checkbox: FC<BooleanControlProps> = (props) => <BooleanControl type="checkbox" {...props} />;

export default Checkbox;
