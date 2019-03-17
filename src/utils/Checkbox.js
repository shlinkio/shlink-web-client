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

const Checkbox = ({ checked, onChange, className, children }) => {
  const id = uuid();

  return (
    <span className={classNames('custom-control custom-checkbox', className)} style={{ display: 'inline' }}>
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked, e)}
      />
      <label className="custom-control-label" htmlFor={id}>{children}</label>
    </span>
  );
};

Checkbox.propTypes = propTypes;

export default Checkbox;
