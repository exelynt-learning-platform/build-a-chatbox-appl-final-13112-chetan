import { memo, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

interface ChatInputProps {
  loading: boolean;
  onSend: (message: string) => void;
}

const MAX_MESSAGE_LENGTH = 4000;

function ChatInput({ loading, onSend }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [value]);

  const submitMessage = () => {
    const trimmedValue = value.trim();

    if (!trimmedValue || loading) {
      return;
    }

    onSend(trimmedValue);
    setValue('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  const isSendDisabled = loading || value.trim().length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-[color:var(--composer-border)] bg-[var(--composer)] p-3 shadow-[var(--shadow-soft)] transition-colors focus-within:border-[color:var(--primary)]"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={loading}
        placeholder={loading ? 'Waiting for the current response...' : 'Message Chatbox'}
        className="max-h-[220px] min-h-[52px] w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-7 text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-70"
        aria-label="Chat message input"
      />

      <div className="mt-2 flex items-center justify-between gap-3 border-t border-[color:var(--composer-border)] px-2 pt-3">
        <p className="text-xs text-[var(--text-muted)]">{value.length}/{MAX_MESSAGE_LENGTH}</p>

        <button
          type="submit"
          disabled={isSendDisabled}
          className="inline-flex min-w-[88px] items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--primary),var(--primary-strong))] px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending' : 'Send'}
        </button>
      </div>
    </form>
  );
}

export default memo(ChatInput);
