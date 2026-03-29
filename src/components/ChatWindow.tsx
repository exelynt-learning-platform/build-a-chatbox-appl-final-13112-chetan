import { memo, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import Loader from './Loader';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
  loading: boolean;
  onSuggestionSelect: (message: string) => void;
}

const EMPTY_STATE_SUGGESTIONS = [
  'Summarize these meeting notes',
  'Rewrite this email to sound more professional',
  'Explain this error message',
  'Help me plan my next steps',
] as const;

function ChatWindow({ messages, loading, onSuggestionSelect }: ChatWindowProps) {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, loading]);

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto px-4 py-8 sm:px-6">
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-1 flex-col items-center justify-center px-2 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,var(--primary),var(--primary-strong))] text-lg font-semibold text-white shadow-[var(--shadow-soft)]">
                CB
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
                How can I help today?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)] sm:text-[15px]">
                Start with a prompt below or pick one of these examples.
              </p>

              <div className="mt-8 grid w-full max-w-4xl gap-3 md:grid-cols-2">
                {EMPTY_STATE_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onSuggestionSelect(suggestion)}
                    className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-5 py-4 text-left text-sm text-[var(--text)] shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--surface-muted)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading ? <Loader /> : null}
              <div ref={bottomAnchorRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChatWindow);
