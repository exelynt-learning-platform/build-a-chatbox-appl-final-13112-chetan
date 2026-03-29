import type { ChatMessage, ChatState } from '../../types';
import chatReducer, { addAIMessage, addUserMessage, clearChat, setError, setLoading } from './chatSlice';

const userMessage: ChatMessage = {
  id: 'user-1',
  role: 'user',
  content: 'Hello',
};

const assistantMessage: ChatMessage = {
  id: 'assistant-1',
  role: 'assistant',
  content: 'Hi there',
};

describe('chatSlice', () => {
  test('returns the expected initial state', () => {
    expect(chatReducer(undefined, { type: 'unknown' })).toEqual({
      messages: [],
      loading: false,
      error: null,
    });
  });

  test('adds a user message and clears the previous error', () => {
    const previousState: ChatState = {
      messages: [],
      loading: false,
      error: 'Previous error',
    };

    const nextState = chatReducer(previousState, addUserMessage(userMessage));

    expect(nextState.messages).toEqual([userMessage]);
    expect(nextState.error).toBeNull();
  });

  test('adds an assistant message', () => {
    const previousState: ChatState = {
      messages: [userMessage],
      loading: false,
      error: null,
    };

    const nextState = chatReducer(previousState, addAIMessage(assistantMessage));

    expect(nextState.messages).toEqual([userMessage, assistantMessage]);
  });

  test('updates loading and error state', () => {
    let nextState = chatReducer(undefined, setLoading(true));
    nextState = chatReducer(nextState, setError('Network issue'));

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe('Network issue');
  });

  test('clears the transcript and resets status flags', () => {
    const previousState: ChatState = {
      messages: [userMessage, assistantMessage],
      loading: true,
      error: 'Network issue',
    };

    const nextState = chatReducer(previousState, clearChat());

    expect(nextState).toEqual({
      messages: [],
      loading: false,
      error: null,
    });
  });
});
