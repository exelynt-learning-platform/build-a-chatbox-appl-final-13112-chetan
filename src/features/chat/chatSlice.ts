import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ChatMessage, ChatState } from '../../types';
import { loadStoredMessages } from './chatStorage';

const initialState: ChatState = {
  messages: loadStoredMessages(),
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      state.error = null;
    },
    addAIMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { addUserMessage, addAIMessage, setLoading, setError, clearChat } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectChatLoading = (state: RootState) => state.chat.loading;
export const selectChatError = (state: RootState) => state.chat.error;

export default chatSlice.reducer;
