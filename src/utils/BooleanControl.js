import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

export const basePropTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  className: PropTypes.string,
};

const propTypes = {
  ...basePropTypes,
  type: PropTypes.oneOf([ 'switch', 'checkbox' ]).isRequired,
};

const BooleanControl = ({ checked, onChange, className, children, type }) => {
  const id = uuid();
  const onChecked = (e) => onChange(e.target.checked, e);
  const typeClasses = {
    'custom-switch': type === 'switch',
    'custom-checkbox': type === 'checkbox',
  };

  return (
    <span className={classNames('custom-control', typeClasses, className)} style={{ display: 'inline' }}>
      <input type="checkbox" className="custom-control-input" id={id} checked={checked} onChange={onChecked} />
      <label className="custom-control-label" htmlFor={id}>{children}</label>
    </span>
  );
};

BooleanControl.propTypes = propTypes;

export default BooleanControl;
