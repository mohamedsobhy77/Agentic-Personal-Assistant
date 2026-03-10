# Agentic Personal Assistant

Upload PDFs, ingest them into a vector database, then chat with an **agent** that can decide when to search your documents.

## High-level architecture

- **Frontend** (`client/`): React + Vite single-page app (upload + chat UI)
- **Backend** (`server/`): Express API (PDF ingestion + agentic chat)
- **Vector DB**: Pinecone index stores embedded PDF chunks

## What the code does 

### Backend behavior

- **PDF ingestion**: `POST /api/ingest`
  - accepts a single PDF file (multipart field name: `file`)
  - loads text from the PDF
  - splits text into overlapping chunks
  - embeds chunks and stores them in Pinecone

- **Chat**: `POST /api/chat`
  - runs a LangChain agent that uses **Ollama** (`ChatOllama`, model `llama3.1`)
  - the agent can call a tool named `search_knowledge_base` to retrieve relevant chunks from Pinecone
  - returns `{ answer: "..." }`

### Frontend behavior

- **Upload panel** posts the selected PDF to `http://localhost:3001/api/ingest`
- **Chat panel** posts messages to `http://localhost:3001/api/chat`
- AI messages render Markdown via `react-markdown`

## Prerequisites

- Node.js v18+
- A Pinecone account + an existing index
- Ollama installed and running locally (recommended), with:
  - LLM model referenced by the server: `llama3.1`
  - embeddings model referenced by ingestion: `nomic-embed-text`

## Setup

### Install dependencies

```bash
npm run install:all
```

### Configure environment variables

Create `server/.env` (the server loads env vars via `dotenv/config`).

Minimum required:

```env
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

## Run (development)

Start both server + client:

```bash
npm run dev
```

- Server: `http://localhost:3001`
- Client: `http://localhost:5173`

## API

### `POST /api/ingest`

- **Content-Type**: `multipart/form-data`
- **Field**: `file` (PDF)
- **Returns**: `{ ok: true }` or `{ error: "..." }`

### `POST /api/chat`

- **Content-Type**: `application/json`
- **Body**: `{ "message": "..." , "sessionId": "optional" }`
- **Returns**: `{ "answer": "..." }` or `{ error: "..." }`

## Project structure

```
agentic-personal-assistant/
├── server/
│   ├── index.js      # Express server + routes
│   ├── agent.js      # Agent runtime + memory
│   ├── tools.js      # Pinecone search tool (search_knowledge_base)
│   └── ingest.js     # PDF ingestion pipeline
└── client/
    └── src/App.jsx   # Upload + chat UI
```

## Important notes (code-level)

### Embedding model mismatch (ingest vs search)

Right now the code uses:
- **Ingestion embeddings**: `OllamaEmbeddings("nomic-embed-text")` in `server/ingest.js`
- **Search embeddings**: `PineconeEmbeddings("llama-text-embed-v2")` in `server/tools.js`

For best retrieval quality, documents and queries should be embedded with the **same model**. If your search results feel weak or irrelevant, this is the first thing to align.

### Session memory defaults to one thread

The server supports a `sessionId` (thread id) for memory, but the current client sends only `{ message }`, so chats use the server’s default thread unless you wire `sessionId` through.

### Vite proxy is configured but bypassed

`client/vite.config.js` has a `/api` proxy, but the current client calls `http://localhost:3001/...` directly. If you want the proxy, change the client to call `/api/chat` and `/api/ingest`.

## Troubleshooting

- **Pinecone errors**: verify `PINECONE_API_KEY` + `PINECONE_INDEX`, and that the index exists.
- **Ingest succeeds but chat can’t find info**: likely the embedding mismatch above.
- **Ollama errors**: ensure Ollama is running and the referenced models are available locally.
