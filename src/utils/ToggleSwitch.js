import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 as uuid } from 'uuid';

const propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]),
  className: PropTypes.string,
};

const ToggleSwitch = ({ checked, onChange, className, children }) => {
  const id = uuid();
  const onChecked = (e) => onChange(e.target.checked, e);

  return (
    <span className={classNames('custom-control custom-switch', className)} style={{ display: 'inline' }}>
      <input type="checkbox" className="custom-control-input" id={id} checked={checked} onChange={onChecked} />
      <label className="custom-control-label" htmlFor={id}>{children}</label>
    </span>
  );
};

ToggleSwitch.propTypes = propTypes;

export default ToggleSwitch;
