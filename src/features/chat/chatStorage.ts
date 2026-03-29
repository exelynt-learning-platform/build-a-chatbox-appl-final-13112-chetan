import type { ChatMessage } from '../../types';

export const CHAT_STORAGE_KEY = 'chatbox-app:messages';

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string'
  );
};

export const loadStoredMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CHAT_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isChatMessage) : [];
  } catch {
    return [];
  }
};

export const persistMessages = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage write failures.
  }
};
