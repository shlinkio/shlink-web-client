import { Component, ReactNode } from 'react';
import { Button } from 'reactstrap';
import { SimpleCard } from '../utils/SimpleCard';

interface ErrorHandlerState {
  hasError: boolean;
}

const ErrorHandlerCreator = (
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

  public render(): ReactNode {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div className="home">
          <SimpleCard className="p-4">
            <h1>Oops! This is awkward :S</h1>
            <p>It seems that something went wrong. Try refreshing the page or just click this button.</p>
            <br />
            <Button outline color="primary" onClick={() => location.reload()}>Take me back</Button>
          </SimpleCard>
        </div>
      );
    }

    const { children } = this.props;
    return children;
  }
};

export default ErrorHandlerCreator;
