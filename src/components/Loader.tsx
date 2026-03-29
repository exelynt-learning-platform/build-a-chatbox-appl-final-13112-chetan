import { memo } from 'react';

function Loader() {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-3xl justify-end">
        <div className="flex max-w-[85%] items-start gap-3 sm:max-w-[78%]">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm text-[var(--text-muted)]">
            <span>Thinking</span>
            <div className="flex items-center gap-1" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="h-2.5 w-2.5 rounded-full bg-[var(--primary)] animate-[spinner-dot_1.1s_infinite]"
                  style={{ animationDelay: `${index * 120}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--assistant-chip)] text-xs font-semibold text-[var(--assistant-chip-text)] sm:flex">
            AI
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Loader);
