# AI Teaching Assistant (Full-Stack RAG)

Production-style AI Teaching Assistant with React, Tailwind, Framer Motion, Node.js, Express, MongoDB, and Retrieval-Augmented Generation (OpenAI or Gemini).

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express (MVC + services)
- Database: MongoDB (Mongoose)
- AI: OpenAI or Gemini (configurable provider)

## Features

- Smart tutor chat interface with animated bubbles, timestamps, typing simulation, and auto-scroll
- Subject-based conversations (Java, OS, DBMS, CN, DSA)
- Upload PDF/TXT/MD notes and index them into vector chunks
- Manual cosine similarity search for top context retrieval
- RAG answer generation with strict context grounding
- Quiz generation from uploaded notes
- Voice input using Web Speech API
- Keyword highlighting in AI answers
- Dark/light theme toggle
- In-memory response caching (TTL based)

## Folder Structure

- client: React frontend
- server: Express backend
- .env.example: environment variables template

## Backend API

- POST /api/upload
  - multipart/form-data
  - fields: file, subject, topic
- POST /api/ask
  - body: { question, subject }
- POST /api/ask/quiz
  - body: { subject, count }

## RAG Flow

1. Upload notes (PDF/TXT/MD)
2. Extract text
3. Chunk text (~360 words with overlap)
4. Generate embeddings with configured provider
5. Store chunks + embeddings in MongoDB
6. On user query:
   - Embed query
   - Compute cosine similarity manually in JavaScript
   - Retrieve top 4 chunks
   - Build context prompt
   - Generate answer from LLM based only on retrieved context

## Setup

1. Copy environment variables:
   - cp .env.example .env
2. Fill values in .env:
   - AI_PROVIDER=openai or AI_PROVIDER=gemini
   - OPENAI_API_KEY (if using OpenAI)
   - GEMINI_API_KEY (if using Gemini)
   - MONGODB_URI
3. Install dependencies:
   - npm install
4. Run development:
   - npm run dev
5. Open frontend:
   - http://localhost:5173

## Build

- npm run build

## Production Notes

- Use managed MongoDB (Atlas)
- Add auth and tenant isolation before multi-user deployment
- Move in-memory cache to Redis for horizontal scaling
- Add background queue for large file ingestion

## Switching to Gemini

Set in [.env.example](.env.example):

- AI_PROVIDER=gemini
- GEMINI_API_KEY=your_gemini_api_key

Recommended defaults already included:

- GEMINI_EMBEDDING_MODEL=text-embedding-004
- GEMINI_CHAT_MODEL=gemini-2.0-flash

Important: re-upload/re-index notes when switching providers so vector dimensions remain consistent.
