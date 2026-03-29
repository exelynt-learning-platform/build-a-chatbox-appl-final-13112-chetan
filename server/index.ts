import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type MessageRole = 'user' | 'assistant';

interface ChatCompletionMessage {
  role: MessageRole;
  content: string;
}

interface ChatCompletionRequestBody {
  model?: string;
  messages?: ChatCompletionMessage[];
}

interface OpenAIChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL?.trim() || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-3.5-turbo';
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const distDirectory = resolve(currentDirectory, '..', 'dist');

const app = express();

const openAIClient = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isChatMessage = (value: unknown): value is ChatCompletionMessage => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string'
  );
};

const getErrorMessageFromResponse = (data: unknown): string | null => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'object' &&
    data.error !== null &&
    'message' in data.error &&
    typeof data.error.message === 'string'
  ) {
    return data.error.message;
  }

  return null;
};

const getProxyError = (error: unknown): { message: string; status: number } => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        message: 'Network issue detected. Check your connection and try again.',
        status: 502,
      };
    }

    const apiMessage = getErrorMessageFromResponse(error.response.data);

    switch (error.response.status) {
      case 401:
        return {
          message: 'Authentication failed. Verify OPENAI_API_KEY and try again.',
          status: 401,
        };
      case 429:
        return {
          message: 'OpenAI is rate limiting requests right now. Please retry in a moment.',
          status: 429,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: 'OpenAI is temporarily unavailable. Please try again shortly.',
          status: error.response.status,
        };
      default:
        return {
          message: apiMessage ?? 'The OpenAI request failed. Please retry.',
          status: error.response.status,
        };
    }
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred while contacting OpenAI.',
    status: 500,
  };
};

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    model: OPENAI_MODEL,
  });
});

app.post('/api/chat/completions', async (request, response) => {
  if (!OPENAI_API_KEY) {
    response.status(500).json({
      error: {
        message: 'Missing server OpenAI API key. Add OPENAI_API_KEY to your .env file.',
      },
    });
    return;
  }

  const body = request.body as ChatCompletionRequestBody;
  const messages = Array.isArray(body.messages) ? body.messages.filter(isChatMessage) : [];

  if (messages.length === 0) {
    response.status(400).json({
      error: {
        message: 'A chat request must include at least one valid message.',
      },
    });
    return;
  }

  try {
    const { data } = await openAIClient.post<OpenAIChatCompletionResponse>(
      '/chat/completions',
      {
        model: typeof body.model === 'string' && body.model.trim() ? body.model.trim() : OPENAI_MODEL,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      },
    );

    response.json(data);
  } catch (error) {
    const { message, status } = getProxyError(error);

    response.status(status).json({
      error: {
        message,
      },
    });
  }
});

if (existsSync(distDirectory)) {
  app.use(express.static(distDirectory));

  app.use((_request, response) => {
    response.sendFile(resolve(distDirectory, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Chatbox server listening on http://localhost:${PORT}`);
});
