import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";
import ErrorBanner from "./components/ErrorBanner";
import {
  clearChat,
  selectChatError,
  selectChatLoading,
  selectMessages,
  setError,
} from "./features/chat/chatSlice";
import { retryLastMessage, sendMessage } from "./features/chat/chatThunks";
import { OPENAI_MODEL } from "./services/openai";
import type { ThemeMode } from "./types";

const THEME_STORAGE_KEY = "chatbox-app:theme";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

function App() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const loading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const canRetry = Boolean(
    error && messages[messages.length - 1]?.role === "user",
  );
  const statusLabel = error ? "Needs attention" : loading ? "Working" : "Ready";

  const handleSend = (message: string) => {
    void dispatch(sendMessage(message));
  };

  const handleRetry = () => {
    void dispatch(retryLastMessage());
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  const handleDismissError = () => {
    dispatch(setError(null));
  };

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="flex h-full overflow-hidden">
        <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-y-auto border-r border-[color:var(--sidebar-border)] bg-[var(--sidebar)] p-3 lg:flex">
          <div className="flex items-center gap-3 rounded-2xl px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(180deg,var(--primary),var(--primary-strong))] text-sm font-semibold text-white">
              CB
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">
                Chatbox
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                OpenAI chat client
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="mt-3 rounded-2xl border border-[color:var(--sidebar-border)] bg-[var(--sidebar-panel)] px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            New chat
          </button>

          <div className="mt-4 rounded-2xl border border-[color:var(--sidebar-border)] bg-[var(--sidebar-panel)] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Session
            </p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Messages</span>
              <span className="font-medium text-[var(--text)]">
                {messages.length}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Status</span>
              <span className="font-medium text-[var(--text)]">
                {statusLabel}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Model</span>
              <span className="font-medium text-[var(--text)]">
                {OPENAI_MODEL}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[color:var(--sidebar-border)] bg-[var(--sidebar-panel)] p-4 text-sm text-[var(--text-muted)]">
            <p className="font-medium text-[var(--text)]">Notes</p>
            <p className="mt-2 leading-6">
              Enter sends the message. Shift+Enter adds a new line.
            </p>
          </div>

          <div className="mt-auto space-y-3">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full rounded-2xl border border-[color:var(--sidebar-border)] bg-[var(--sidebar-panel)] px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)]"
            >
              {theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </button>
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--main)]">
          <header className="shrink-0 border-b border-[color:var(--border)] px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)] lg:hidden"
                >
                  New chat
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text)]">
                    Chatbox
                  </p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {OPENAI_MODEL}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    error
                      ? "bg-[var(--danger-surface)] text-[var(--danger)]"
                      : loading
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      error
                        ? "bg-[var(--danger)]"
                        : loading
                          ? "animate-pulse bg-[var(--primary)]"
                          : "bg-[var(--text-muted)]"
                    }`}
                  />
                  {statusLabel}
                </span>

                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-xl border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-muted)]"
                >
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </header>

          <div className="shrink-0 px-4 pt-4 sm:px-6">
            <div className="mx-auto max-w-5xl">
              <ErrorBanner
                message={error}
                canRetry={canRetry}
                onRetry={handleRetry}
                onDismiss={handleDismissError}
              />
            </div>
          </div>

          <ChatWindow
            messages={messages}
            loading={loading}
            onSuggestionSelect={handleSend}
          />

          <div className="shrink-0 border-t border-[color:var(--border)] bg-[var(--composer-shell)] px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput loading={loading} onSend={handleSend} />
              <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
                Chatbox can make mistakes. Check important information before
                using it.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
