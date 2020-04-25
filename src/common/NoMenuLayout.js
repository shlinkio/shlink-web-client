import React from 'react';
import PropTypes from 'prop-types';
import './NoMenuLayout.scss';

const propTypes = {
  children: PropTypes.node,
};

const NoMenuLayout = ({ children }) => <div className="no-menu-wrapper">{children}</div>;

NoMenuLayout.propTypes = propTypes;

export default NoMenuLayout;
