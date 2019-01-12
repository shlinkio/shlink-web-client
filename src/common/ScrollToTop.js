import React from 'react';
import PropTypes from 'prop-types';

const ScrollToTop = ({ scrollTo }) => class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.node,
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location !== prevProps.location) {
      scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
};

export default ScrollToTop;
