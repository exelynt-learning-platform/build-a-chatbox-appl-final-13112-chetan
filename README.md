# Chatbox Application

React and Redux Toolkit chat application with a backend proxy for OpenAI API requests.

## Stack

- React
- TypeScript
- Redux Toolkit
- redux-thunk
- Tailwind CSS
- Axios
- Express
- Jest
- React Testing Library
- Vite

## Features

- Send a message with the button or the Enter key
- Show user and assistant messages in a chat layout
- Store messages, loading state, and error state in Redux
- Retry failed requests
- Persist chat history in `localStorage`
- Responsive layout for desktop and mobile
- Dark mode toggle

## Project structure

```text
server
  index.ts
src
  app
    hooks.ts
    store.ts
  components
    ChatInput.tsx
    ChatInput.test.tsx
    ChatWindow.tsx
    ErrorBanner.tsx
    Loader.tsx
    MessageBubble.tsx
  features
    chat
      chatSlice.ts
      chatSlice.test.ts
      chatStorage.ts
      chatThunks.ts
      chatThunks.test.ts
  services
    openai.ts
  test
    setupTests.ts
  types
    index.ts
  App.tsx
  index.css
  main.tsx
tsconfig.server.json
```

## Environment variables

Create a `.env` file from `.env.example`.

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
PORT=8787

VITE_OPENAI_BASE_URL=/api
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

## Getting started

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Start the development environment:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

Run tests:

```bash
npm test
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run start`
- `npm run typecheck`
- `npm run typecheck:server`
- `npm test`
- `npm run test:watch`

## Notes

- The chat state lives in Redux and is persisted with `localStorage`.
- Frontend API requests are handled in `src/services/openai.ts`.
- The backend proxy lives in `server/index.ts`.
- Async chat actions are handled with thunk in `src/features/chat/chatThunks.ts`.
- The browser calls `/api/chat/completions`, and the server uses `OPENAI_API_KEY`.

## Security

The OpenAI API key is read only on the server from `OPENAI_API_KEY`. The frontend talks to the local `/api` proxy, so the secret is not bundled into client-side code.
