# AI Support System

An AI-powered customer support system built with **Hono**, **Groq LLM**, **Prisma**, and **React + Vite**.

This project demonstrates:

- AI Agent architecture
- Streaming LLM responses
- Tool-based backend logic (Order & Billing agents)
- Rate limiting
- Dockerized backend
- Render deployment
- Professional frontend UI

---

# Project Structure

ai-support/
│
├── ai-support-backend/ # Hono + Prisma backend
│
└── ai-support-frontend/ # React + Vite frontend

---

# System Architecture

### Request Flow

1. User sends message from frontend.
2. Backend saves message to database.
3. Router Agent detects intent (order / billing).
4. Domain agent selects correct tool.
5. Tool fetches structured data from database.
6. LLM converts structured JSON into a user-friendly reply.
7. Response is streamed to frontend.
8. Assistant message is saved in the database.

---

# Features

## 🔹 Backend

- Hono framework
- Groq LLaMA 3.1 integration
- Router Agent
- Order Agent
- Billing Agent
- Tool-based architecture
- Streaming responses
- Prisma ORM
- Rate limiting (10 requests per minute)
- Docker support
- Render deployment ready

## Frontend

- React + Vite + TypeScript
- Professional SaaS-style UI
- Streaming AI responses
- Rotating loader ("Thinking...", "Processing...")
- Auto-scroll chat
- Clean chat bubble design

---

# Backend Setup

Navigate to backend:

```bash
cd ai_backend
1️ Install dependencies
npm install
2️ Setup environment variables
Create a .env file:

GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_database_url

3️ Setup Prisma
npx prisma generate
npx prisma migrate dev

4️ Run backend (development)
npm run dev
Backend runs at:

http://localhost:3000

5️ Build for production
npm run build
npm start

-Docker (Backend)
Build Docker Image
docker build -t ai-backend .
Run Container
docker run -p 3000:3000 ai-backend
Backend must use:

const port = process.env.PORT || 3000;

-Deploy Backend on Render
Render Configuration
Root Directory → ai-support-backend

Environment → Node

Build Command:

npm install && npm run build
Start Command:

npm run start
Add Environment Variables in Render Dashboard:
GROQ_API_KEY
DATABASE_URL

- Frontend Setup
Navigate to frontend:

cd ai-support-frontend
Install dependencies
npm install
Run frontend
npm run dev
Frontend runs at:

http://localhost:5173
Make sure API URL in frontend points to backend:

Development:

http://localhost:3000/api/chat/messages
Production:

https://your-render-backend-url.onrender.com/api/chat/messages

-Rate Limiting
10 requests per minute

Identified using:

userId

IP address

Prevents API abuse


-Database Models
Order
model Order {
  id       String @id
  userId   String
  status   String
  tracking String?
  items    Json?
}
Invoice
model Invoice {
  id           String @id
  userId       String
  amount       Float
  status       String
  refundStatus String?
}

-AI Agents
Router Agent
Detects user intent and routes to correct domain agent.

Order Agent
Tools:

getOrderDetails

getDeliveryStatus

Billing Agent
Tools:

getInvoiceDetails

checkRefundStatus

Each agent returns structured JSON which is transformed into a polite user-facing response by the LLM.

- API Endpoints
POST /api/chat/messages
Send user message and receive streaming AI response.

GET /api/chat/conversations
Get all conversations.

GET /api/chat/conversations/:id
Get specific conversation.

DELETE /api/chat/conversations/:id
Delete conversation.

- Technical Highlights
Tool-based AI architecture

Context carry-forward logic (without database storage)

Streaming responses using AI SDK

Structured prompt engineering

Prisma ORM integration

Production-ready Docker setup

Rate limiting middleware

Professional frontend UI

- Future Improvements
Full Turborepo monorepo setup

Hono RPC for end-to-end type safety

Redis-based rate limiting

Authentication system

Dark mode

CI/CD pipeline

Docker Compose full-stack deployment

```
