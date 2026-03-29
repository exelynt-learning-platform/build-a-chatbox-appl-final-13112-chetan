import { configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import { persistMessages } from '../features/chat/chatStorage';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
  devTools: import.meta.env.DEV,
});

let previousMessages = store.getState().chat.messages;

store.subscribe(() => {
  const nextMessages = store.getState().chat.messages;

  if (nextMessages !== previousMessages) {
    previousMessages = nextMessages;
    persistMessages(nextMessages);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;
