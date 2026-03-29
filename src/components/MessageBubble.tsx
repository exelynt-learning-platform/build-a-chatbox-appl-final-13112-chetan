import { memo } from 'react';
import type { ChatMessage } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className="w-full motion-safe:animate-[bubble-in_220ms_ease-out]">
      <div className={`mx-auto flex w-full max-w-3xl ${isUser ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`flex min-w-0 gap-3 ${
            isUser ? 'max-w-[85%] justify-start sm:max-w-[78%]' : 'max-w-[85%] justify-end sm:max-w-[78%]'
          }`}
        >
          <div
            className={`min-w-0 rounded-[1.6rem] px-5 py-3 ${
              isUser
                ? 'bg-[var(--user-bubble)] text-[var(--user-bubble-text)]'
                : 'border border-[color:var(--border)] bg-[var(--surface-strong)] text-[var(--text)]'
            }`}
          >
            <p className="whitespace-pre-wrap break-words text-[15px] leading-7">{message.content}</p>
          </div>

          {isUser ? null : (
            <div className="mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--assistant-chip)] text-xs font-semibold text-[var(--assistant-chip-text)] sm:flex">
              AI
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
