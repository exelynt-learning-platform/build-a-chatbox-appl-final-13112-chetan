# build-a-chatbox-appl-final-13112-chetan

Final Project Assignment - This repository contains the complete final project code and documentation.

## Stack

- React
- TypeScript
- Redux Toolkit
- redux-thunk
- Tailwind CSS
- Axios
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
```

## Environment variables

Create a `.env` file from `.env.example`.

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
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

Start the dev server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`
- `npm test`
- `npm run test:watch`

## Notes

- The chat state lives in Redux and is persisted with `localStorage`.
- API requests are handled in `src/services/openai.ts`.
- Async chat actions are handled with thunk in `src/features/chat/chatThunks.ts`.
- The API key is read from `import.meta.env.VITE_OPENAI_API_KEY`.

## Security

The assignment asks for the API key to be stored in environment variables, and this project does that.

One limitation of a frontend-only app is that `VITE_` variables are still included in the client build. For a real production deployment, the OpenAI request should go through a backend or serverless function instead of calling the API directly from the browser.
