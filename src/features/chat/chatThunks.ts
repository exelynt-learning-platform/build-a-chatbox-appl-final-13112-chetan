import type { AppThunk } from '../../app/store';
import { createChatCompletion } from '../../services/openai';
import type { ChatMessage } from '../../types';
import { CHAT_ERROR_MESSAGES } from './chatConstants';
import { addAIMessage, addUserMessage, setError, setLoading } from './chatSlice';

const buildMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
});

const requestAssistantReply =
  (messages: ChatMessage[]): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(setError(null));
    dispatch(setLoading(true));

    try {
      const assistantContent = await createChatCompletion(messages);
      dispatch(addAIMessage(buildMessage('assistant', assistantContent)));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : CHAT_ERROR_MESSAGES.assistantReplyFailed,
        ),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const sendMessage =
  (content: string): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const trimmedContent = content.trim();

    if (!trimmedContent || getState().chat.loading) {
      return;
    }

    dispatch(addUserMessage(buildMessage('user', trimmedContent)));
    const conversation = getState().chat.messages;

    await dispatch(requestAssistantReply(conversation));
  };

export const retryLastMessage =
  (): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    const { loading, messages } = getState().chat;

    if (loading) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
      dispatch(setError(CHAT_ERROR_MESSAGES.retryUnavailable));
      return;
    }

    await dispatch(requestAssistantReply(messages));
  };
