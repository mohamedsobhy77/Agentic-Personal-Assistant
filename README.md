
<img width="2752" height="1536" alt="unnamed (3)" src="https://github.com/user-attachments/assets/221ed1d0-6acc-41c6-9f20-b72ab1798e70" />

# 🤖 Agentic Personal Assistant

An **AI-powered document assistant** that allows users to upload PDFs, convert them into embeddings, store them in a vector database, and chat with an **agentic AI** that can intelligently decide when to search the knowledge base.

The system uses a **Retrieval-Augmented Generation (RAG)** architecture powered by **LangChain agents**, **Pinecone vector database**, and a **local LLM running via Ollama**.

---

# 🚀 Demo Features

* Upload PDF documents
* Automatically process and split documents into chunks
* Generate vector embeddings
* Store embeddings in Pinecone
* Chat with an AI agent
* The agent decides **when to search the knowledge base**
* Retrieval-based answers grounded in uploaded documents
* Markdown-rendered AI responses

---

# 🏗 High-level Architecture

* **Frontend (`client/`)**

  React + Vite single-page application providing:

  * PDF upload interface
  * Chat interface
  * Markdown AI response rendering

* **Backend (`server/`)**

  Express.js API responsible for:

  * PDF ingestion
  * Vector embedding
  * Pinecone storage
  * Running the LangChain agent

* **Vector Database**

  Pinecone stores embedded PDF chunks for semantic search.

---

# 🔄 System Architecture Flow

1. User uploads a **PDF document**
2. Backend extracts text from the PDF
3. Text is split into **overlapping chunks**
4. Each chunk is converted into **vector embeddings**
5. Embeddings are stored in **Pinecone**
6. User asks a question
7. A **LangChain Agent** decides whether to:

   * Answer directly
   * Call the tool `search_knowledge_base`
8. Relevant document chunks are retrieved
9. The LLM generates a **context-aware answer**

---

# 🧰 Tools & Technologies Used

## Backend

* **Node.js** – JavaScript runtime for server-side development
* **Express.js** – Lightweight backend framework for APIs
* **LangChain** – Framework for building LLM-powered applications
* **Ollama** – Local LLM runtime
* **Pinecone** – Vector database for semantic search
* **Multer** – Middleware for handling file uploads
* **dotenv** – Environment variable management

---

## 🧠 AI / LLM Stack

* **LLM Model:** `llama3.1`
* **Embedding Model:** `nomic-embed-text`
* **Agent Framework:** LangChain Agent
* **Architecture:** Retrieval-Augmented Generation (RAG)

### Agent Tool

Custom tool implemented:

```
search_knowledge_base
```

Responsible for:

* Querying Pinecone
* Retrieving relevant document chunks
* Passing context back to the LLM

---

# 🎨 Frontend

* **React** – User interface library
* **Vite** – Fast frontend development server and build tool
* **React Markdown** – Rendering AI responses with Markdown
* **Fetch API** – Communication with backend APIs

---

# 🛠 Development Tools

* Git
* GitHub
* npm
* Node.js v18+

---

# 📁 Project Structure

```
agentic-personal-assistant/
│
├── server/
│   ├── index.js
│   ├── agent.js
│   ├── tools.js
│   └── ingest.js
│
└── client/
    └── src/
        └── App.jsx
```

### Server Files

| File      | Responsibility                   |
| --------- | -------------------------------- |
| index.js  | Express server + API routes      |
| agent.js  | LangChain agent runtime + memory |
| tools.js  | Pinecone retrieval tool          |
| ingest.js | PDF ingestion pipeline           |

---

# 🔌 API Endpoints

## 📥 Ingest PDF

`POST /api/ingest`

Uploads and processes a PDF file.

### Content-Type

```
multipart/form-data
```

### Field

```
file
```

### Response

```
{ "ok": true }
```

or

```
{ "error": "..." }
```

---

## 💬 Chat with Agent

`POST /api/chat`

Sends a user message to the AI agent.

### Content-Type

```
application/json
```

### Request

```json
{
  "message": "Your question",
  "sessionId": "optional"
}
```

### Response

```json
{
  "answer": "AI response"
}
```

---

# ⚙️ Prerequisites

Make sure the following tools are installed:

* **Node.js v18+**
* **Ollama**
* **Pinecone account**

---

# 📦 Required Ollama Models

Install the required models locally:

```bash
ollama pull llama3.1
ollama pull nomic-embed-text
```

---

# 🛠 Setup

## 1️⃣ Install Dependencies

```bash
npm run install:all
```

---

## 2️⃣ Configure Environment Variables

Create:

```
server/.env
```

Add:

```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_pinecone_index_name
```

---

# ▶️ Run the Project

Start both backend and frontend:

```bash
npm run dev
```

### Server

```
http://localhost:3001
```

### Client

```
http://localhost:5173
```

---

# ⚠️ Important Implementation Notes

## Embedding Model Mismatch

Currently the code uses:

**Ingestion embeddings**

```
OllamaEmbeddings("nomic-embed-text")
```

in

```
server/ingest.js
```

**Search embeddings**

```
PineconeEmbeddings("llama-text-embed-v2")
```

in

```
server/tools.js
```

For best retrieval results, **documents and queries should use the same embedding model**.

---

## Session Memory

The backend supports:

```
sessionId
```

However the current client sends only:

```
{ message }
```

So all chats run in the **default thread** unless sessionId is passed from the frontend.

---

## Vite Proxy

`vite.config.js` includes a proxy for:

```
/api
```

But the current frontend calls:

```
http://localhost:3001
```

directly.

To use the proxy change client requests to:

```
/api/chat
/api/ingest
```

---

# 🧯 Troubleshooting

### Pinecone errors

* Verify `PINECONE_API_KEY`
* Verify `PINECONE_INDEX`
* Ensure the index exists

### Ingest works but answers are irrelevant

Likely caused by **embedding model mismatch**.

### Ollama errors

Ensure:

* Ollama is running
* Required models are installed locally

---

# 🚀 Future Improvements

* Streaming responses
* Multi-document indexing
* Conversation memory persistence
* Source citations in answers
* Drag & drop PDF upload
* Authentication system
* Cloud LLM support (OpenAI / Claude)

---

# 📄 License

This project is open-source and available under the **MIT License**.



