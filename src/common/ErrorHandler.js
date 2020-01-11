import React from 'react';
import * as PropTypes from 'prop-types';
import './ErrorHandler.scss';
import { Button } from 'reactstrap';

// FIXME Replace with typescript: (window, console)
const ErrorHandler = ({ location }, { error }) => class ErrorHandler extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(e) {
    if (process.env.NODE_ENV !== 'development') {
      error(e);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-handler">
          <h1>Oops! This is awkward :S</h1>
          <p>It seems that something went wrong. Try refreshing the page or just click this button.</p>
          <br />
          <Button outline color="primary" onClick={() => location.reload()}>Take me back</Button>
        </div>
      );
    }

    return this.props.children;
  }
};

export default ErrorHandler;
