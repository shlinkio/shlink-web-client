import { SimpleCard } from '@shlinkio/shlink-frontend-kit';
import type { PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';

type ErrorHandlerProps = PropsWithChildren<{
  location?: typeof window.location;
  console?: typeof window.console;
}>;

type ErrorHandlerState = {
  hasError: boolean;
};

export class ErrorHandler extends Component<ErrorHandlerProps, ErrorHandlerState> {
  public constructor(props: ErrorHandlerProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorHandlerState {
    return { hasError: true };
  }

  public componentDidCatch(e: Error): void {
    const { console = globalThis.console } = this.props;
    console.error(e);
  }

  public render(): ReactNode {
    const { hasError } = this.state;
    const { location = globalThis.location } = this.props;

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
}
