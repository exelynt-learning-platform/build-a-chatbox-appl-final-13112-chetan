import axios from 'axios';
import type { ChatMessage, OpenAIChatCompletionResponse } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY?.trim();
export const OPENAI_MODEL = import.meta.env.VITE_OPENAI_MODEL?.trim() || 'gpt-3.5-turbo';

const openAIClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getOpenAIErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Network issue detected. Check your connection and try again.';
    }

    const apiMessage =
      typeof error.response.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data &&
      typeof error.response.data.error === 'object' &&
      error.response.data.error !== null &&
      'message' in error.response.data.error &&
      typeof error.response.data.error.message === 'string'
        ? error.response.data.error.message
        : null;

    switch (error.response.status) {
      case 401:
        return 'Authentication failed. Verify VITE_OPENAI_API_KEY and try again.';
      case 429:
        return 'OpenAI is rate limiting requests right now. Please retry in a moment.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'OpenAI is temporarily unavailable. Please try again shortly.';
      default:
        return apiMessage ?? 'The OpenAI request failed. Please retry.';
    }
  }

  return error instanceof Error ? error.message : 'An unexpected error occurred while contacting OpenAI.';
};

export const createChatCompletion = async (messages: ChatMessage[]): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key. Add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const { data } = await openAIClient.post<OpenAIChatCompletionResponse>(
      '/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: messages.map(({ role, content }) => ({ role, content })),
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    const assistantMessage = data.choices?.[0]?.message?.content?.trim();

    if (!assistantMessage) {
      throw new Error('OpenAI returned an empty response. Please try again.');
    }

    return assistantMessage;
  } catch (error) {
    throw new Error(getOpenAIErrorMessage(error));
  }
};
