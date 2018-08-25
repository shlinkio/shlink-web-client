import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const propTypes = {
  location: PropTypes.object,
  window: PropTypes.shape({
    scrollTo: PropTypes.func,
  }),
  children: PropTypes.node,
};
const defaultProps = {
  window,
};

export class ScrollToTopComponent extends React.Component {
  componentDidUpdate(prevProps) {
    const { location, window } = this.props;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTopComponent.defaultProps = defaultProps;
ScrollToTopComponent.propTypes = propTypes;

const ScrollToTop = withRouter(ScrollToTopComponent);

export default ScrollToTop;
