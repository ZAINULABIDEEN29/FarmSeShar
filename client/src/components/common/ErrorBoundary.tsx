import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    this.setState({
      error,
      errorInfo,
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const handleGoHome = (): void => {
    window.location.href = "/";
  };
  const handleReload = (): void => {
    window.location.reload();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        {}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        {}
        <p className="text-gray-600 mb-6">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        {}
        {import.meta.env.DEV && error?.stack && (
          <details className="mb-6 text-left">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-gray-600 bg-gray-50 p-4 rounded overflow-auto max-h-48">
              {error.stack}
            </pre>
          </details>
        )}
        {}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoHome}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            onClick={handleReload}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50 font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};
const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};
export default ErrorBoundary;
