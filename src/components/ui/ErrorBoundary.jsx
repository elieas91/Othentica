import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('❌ ErrorBoundary caught an error:', error);
    console.error('❌ Error Info:', errorInfo);
    console.error('❌ Error Stack:', error.stack);
    console.error('❌ Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section className="py-16 bg-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Othentica FZC LLC
            </h2>
            <p className="text-primary/70 text-lg">
              Follow us on social media for updates and insights
            </p>
            <div className="mt-8">
              <a
                href="https://www.instagram.com/othenticaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
