import { Component, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="text-5xl mb-4">🐛</div>
          <h2 className="font-display text-xl font-bold text-ink mb-2">Oops! Something went wrong</h2>
          <p className="text-ink-secondary text-sm mb-6 max-w-md">
            Don't worry — your progress is saved. Try refreshing the page.
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky text-white font-display font-semibold text-sm hover:bg-sky-light transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
