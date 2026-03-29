export type MessageRole = 'user' | 'assistant';
export type ThemeMode = 'light' | 'dark';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export interface OpenAIChatCompletionResponse {
  choices: Array<{
    message: {
      role: 'assistant';
      content: string | null;
    };
  }>;
}
