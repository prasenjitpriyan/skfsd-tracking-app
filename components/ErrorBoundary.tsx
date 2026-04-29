import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Surface useful diagnostics in the browser console
    console.error('[ErrorBoundary] Uncaught render error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-4">
          <Alert variant="destructive">
            <AlertTitle>App failed to load</AlertTitle>
            <AlertDescription>
              A runtime error prevented the UI from rendering. Please reload.
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={this.handleReload}>Reload</Button>
          </div>

          {this.state.error?.message ? (
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {this.state.error.message}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }
}
