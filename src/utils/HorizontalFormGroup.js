import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
};

export const HorizontalFormGroup = ({ children, value, onChange, id = uuid(), type = 'text', required = true }) => (
  <div className="form-group row">
    <label htmlFor={id} className="col-lg-1 col-md-2 col-form-label create-server__label">
      {children}:
    </label>
    <div className="col-lg-11 col-md-10">
      <input
        className="form-control"
        type={type}
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

HorizontalFormGroup.propTypes = propTypes;
