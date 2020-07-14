import React from 'react';
import BooleanControl, { basePropTypes } from './BooleanControl';

const Checkbox = (props) => <BooleanControl type="checkbox" {...props} />;

Checkbox.propTypes = basePropTypes;

export default Checkbox;
