import React from 'react';
import PropTypes from 'prop-types';

export default class ScrollToTop extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    window: PropTypes.shape({
      scrollTo: PropTypes.func,
    }),
    children: PropTypes.node,
  };
  static defaultProps = {
    window: global.window,
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
