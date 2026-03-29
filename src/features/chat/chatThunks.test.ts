import { configureStore } from '@reduxjs/toolkit';
import { createChatCompletion } from '../../services/openai';
import chatReducer from './chatSlice';
import { retryLastMessage, sendMessage } from './chatThunks';

jest.mock('../../services/openai', () => ({
  createChatCompletion: jest.fn(),
  OPENAI_MODEL: 'gpt-3.5-turbo',
}));

const mockedCreateChatCompletion = createChatCompletion as jest.MockedFunction<typeof createChatCompletion>;

const createTestStore = () =>
  configureStore({
    reducer: {
      chat: chatReducer,
    },
  });

describe('chat thunks', () => {
  beforeEach(() => {
    mockedCreateChatCompletion.mockReset();
    window.localStorage.clear();
  });

  test('sendMessage stores both the user message and the assistant reply', async () => {
    mockedCreateChatCompletion.mockResolvedValue('Assistant response');
    const store = createTestStore();

    await store.dispatch(sendMessage('Hello assistant'));

    expect(mockedCreateChatCompletion).toHaveBeenCalledWith([
      expect.objectContaining({
        role: 'user',
        content: 'Hello assistant',
      }),
    ]);

    expect(store.getState().chat).toMatchObject({
      loading: false,
      error: null,
    });
    expect(store.getState().chat.messages).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'Hello assistant',
      }),
      expect.objectContaining({
        role: 'assistant',
        content: 'Assistant response',
      }),
    ]);
  });

  test('sendMessage keeps the user message and stores a readable error when the API fails', async () => {
    mockedCreateChatCompletion.mockRejectedValue(new Error('Authentication failed'));
    const store = createTestStore();

    await store.dispatch(sendMessage('Hello assistant'));

    expect(store.getState().chat.messages).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'Hello assistant',
      }),
    ]);
    expect(store.getState().chat.loading).toBe(false);
    expect(store.getState().chat.error).toBe('Authentication failed');
  });

  test('retryLastMessage requests a fresh assistant reply for the last failed user message', async () => {
    mockedCreateChatCompletion.mockRejectedValueOnce(new Error('Temporary failure')).mockResolvedValueOnce('Recovered');
    const store = createTestStore();

    await store.dispatch(sendMessage('Please retry this'));
    await store.dispatch(retryLastMessage());

    expect(mockedCreateChatCompletion).toHaveBeenCalledTimes(2);
    expect(store.getState().chat.messages).toEqual([
      expect.objectContaining({
        role: 'user',
        content: 'Please retry this',
      }),
      expect.objectContaining({
        role: 'assistant',
        content: 'Recovered',
      }),
    ]);
    expect(store.getState().chat.error).toBeNull();
  });
});
