import { Component, ReactNode } from 'react';
import { Button } from 'reactstrap';
import './ErrorHandler.scss';

interface ErrorHandlerState {
  hasError: boolean;
}

const ErrorHandler = (
  { location }: Window,
  { error }: Console,
) => class ErrorHandler extends Component<any, ErrorHandlerState> {
  public constructor(props: object) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorHandlerState {
    return { hasError: true };
  }

  public componentDidCatch(e: Error): void {
    if (process.env.NODE_ENV !== 'development') {
      error(e);
    }
  }

  public render(): ReactNode | undefined {
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
