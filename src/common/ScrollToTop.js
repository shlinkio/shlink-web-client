import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

export class ScrollToTopComponent extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    window: PropTypes.shape({
      scrollTo: PropTypes.func,
    }),
    children: PropTypes.node,
  };
  static defaultProps = {
    window,
  };

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

const ScrollToTop = withRouter(ScrollToTopComponent);

export default ScrollToTop;
