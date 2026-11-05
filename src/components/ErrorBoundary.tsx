import { Component, type ErrorInfo, type ReactNode } from 'react';
import { STORAGE_KEY } from '../cv/storage';

interface State {
  error: Error | null;
}

/**
 * Catches rendering errors so one bug doesn't blank the whole app, and lets
 * the user download their saved data before reloading.
 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected error', error, info.componentStack);
  }

  private downloadBackup = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing to download.
    }
    if (!saved) return;
    const url = URL.createObjectURL(new Blob([saved], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'cv-backup.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="crash-screen" role="alert">
        <h1>Something went wrong</h1>
        <p>Your CV is saved in this browser. Download a backup to be safe, then reload the page.</p>
        <div className="crash-actions">
          <button type="button" className="btn-secondary" onClick={this.downloadBackup}>
            Download backup
          </button>
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}
