import React from 'react';
import { withRouter } from 'react-router-dom'

export class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    const { location, window } = this.props;

    if (location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop.defaultProps = {
  window
};

export default withRouter(ScrollToTop);
