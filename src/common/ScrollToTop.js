import React from 'react';
import PropTypes from 'prop-types';

const ScrollToTop = ({ scrollTo }) => class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.node,
  };

  componentDidUpdate({ location: prevLocation }) {
    const { location } = this.props;

    if (location !== prevLocation) {
      scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
};

export default ScrollToTop;
