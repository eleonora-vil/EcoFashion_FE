import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: any;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('Dashboard error boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-xl font-semibold mb-2">Đã xảy ra lỗi khi tải trang</h2>
              <p className="text-gray-600">Vui lòng tải lại trang hoặc quay lại sau.</p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}


