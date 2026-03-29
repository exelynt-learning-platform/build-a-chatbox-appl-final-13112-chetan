import { memo } from 'react';

interface ErrorBannerProps {
  message: string | null;
  canRetry: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}

function ErrorBanner({ message, canRetry, onRetry, onDismiss }: ErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-4 flex flex-col gap-3 rounded-2xl border border-[color:var(--danger-border)] bg-[var(--danger-surface)] p-4 text-sm sm:flex-row sm:items-start sm:justify-between"
    >
      <div>
        <p className="font-medium text-[var(--danger)]">Something went wrong</p>
        <p className="mt-1 leading-6 text-[var(--text)]">{message}</p>
      </div>

      <div className="flex shrink-0 gap-2">
        {canRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-[var(--danger)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Retry
          </button>
        ) : null}

        <button
          type="button"
          onClick={onDismiss}
          className="rounded-xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default memo(ErrorBanner);
