import { Component, type ErrorInfo, type ReactNode } from "react";

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {}

  override render() {
    if (this.state.hasError) {
      return (
        <section className="panel">
          <h2>Unexpected error</h2>
          <p>The application hit a runtime error. Refresh and retry.</p>
        </section>
      );
    }
    return this.props.children;
  }
}
