# SevaAI — AI-Powered NGO Government Collaboration Platform

<div align="center">
  <h2>🌟 SevaAI</h2>
  <p><em>Connecting NGOs, Government, and Citizens through the power of AI</em></p>

  ![SevaAI Platform](https://img.shields.io/badge/SevaAI-v1.0.0-6366f1?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
  ![Python](https://img.shields.io/badge/Python-FastAPI-009688?style=flat-square&logo=fastapi)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
  ![AI](https://img.shields.io/badge/AI-RAG+LangChain-FF6B35?style=flat-square)
</div>

---

## 📋 Overview

SevaAI is a production-level, AI-powered civic technology platform that intelligently connects:
- 🏢 **NGOs** — with government schemes, CSR funding, and project management tools
- 🏛️ **Government Officers** — with NGO verification, monitoring, and district analytics  
- 👥 **Volunteers** — with NGO opportunities and impact tracking
- 🧑‍🤝‍🧑 **Citizens** — with government benefits in Hindi & English via AI assistant

### Key Features
| Feature | Description |
|---------|-------------|
| 🤖 **RAG AI Assistant** | LangChain + ChromaDB powered chatbot with source citations |
| 📋 **Scheme Intelligence** | 850+ government schemes with AI recommendations |
| 📄 **Document Analyzer** | AI-powered compliance check & information extraction |
| 💡 **Proposal Generator** | Complete NGO project proposals in seconds |
| 📊 **Impact Analytics** | Real-time dashboards with Recharts visualizations |
| 🔒 **Security** | JWT auth, RBAC, rate limiting, audit logs |
| 🌐 **Bilingual** | English + Hindi language support |

---

## 🏗️ Architecture

```
sevaAI/
├── frontend/          # React 18 + Vite + Tailwind CSS + Redux Toolkit
├── backend/           # Node.js + Express + MongoDB + JWT
└── ai-service/        # Python FastAPI + LangChain + ChromaDB (RAG)
```

**RAG Flow:**
```
User Question → Backend API → AI Service → ChromaDB Retrieval → LLM → Response + Sources
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Python 3.10+ (for AI service)
- Git

### 1. Clone & Setup

```bash
git clone <repo-url>
cd sevaAI
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env        # Edit with your values
npm install
npm run dev                 # Starts on port 5000
```

**Seed the database with demo data:**
```bash
npm run seed
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev                 # Starts on port 5173
```

### 4. AI Service Setup (Optional — for full RAG)

```bash
cd ai-service
cp .env.example .env        # Add your OPENAI_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> **Without AI Service**: The platform works with intelligent fallback responses. Add your OpenAI API key for full RAG functionality.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| NGO Admin | ngo@sevaai.in | NGO@123 |
| Government Officer | govt@sevaai.in | Govt@123 |
| Citizen | citizen@sevaai.in | Cit@123 |
| Volunteer | volunteer@sevaai.in | Vol@123 |
| System Admin | admin@sevaai.in | Admin@123 |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sevaai
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### AI Service (`ai-service/.env`)
```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
EMBEDDING_MODEL=text-embedding-3-small
CHROMA_DB_PATH=./chroma_db
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

---

## 📱 Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/schemes` | Scheme Search | Public |
| `/schemes/:id` | Scheme Detail | Public |
| `/dashboard/ngo` | NGO Dashboard | NGO Admin |
| `/dashboard/gov` | Government Dashboard | Gov Officer |
| `/dashboard/citizen` | Citizen Portal | Citizen |
| `/chat` | AI Chat Assistant | Authenticated |
| `/documents` | Document Analyzer | Authenticated |
| `/proposal` | Proposal Generator | Authenticated |
| `/analytics` | Analytics | Authenticated |
| `/profile` | Profile Settings | Authenticated |
| `/ngo/profile` | NGO Profile | NGO Admin |

---

## 🤖 AI Features

### RAG Pipeline
1. Documents ingested → text chunked → embedded → stored in ChromaDB
2. User query → embedded → top-k similarity search
3. Retrieved chunks + query → GPT-4o prompt → response + sources

### AI Capabilities
- ✅ Government scheme explanations with source citations
- ✅ Compliance requirement analysis  
- ✅ Document summarization & information extraction
- ✅ Project proposal generation
- ✅ Funding opportunity matching
- ✅ Hindi language support
- ✅ Confidence scoring & transparency

---

## 🔒 Security Features

- **JWT Authentication** with refresh token rotation
- **Role-Based Access Control** (5 roles)
- **Rate Limiting** (200 req/15min general, 20 req/15min auth)
- **Helmet.js** security headers
- **Input validation** via express-validator
- **Audit Logs** for all user actions
- **Secure file upload** with type validation & size limits
- **Password hashing** with bcrypt (salt rounds: 12)

---

## 🗃️ Database Models

- **User** — Authentication, roles, profile
- **NGO** — Organization details, focus areas, certifications
- **Scheme** — Government schemes with full eligibility/benefits
- **Project** — NGO projects with milestones, budget, impact
- **Document** — Uploaded files with AI analysis results
- **ChatHistory** — Full conversation threads with sources
- **Beneficiary** — Citizen profiles with scheme enrollment
- **AuditLog** — Security and compliance tracking

---

## 📊 Tech Stack

### Frontend
- React 18 + Vite 5
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v6
- Redux Toolkit + React Redux
- Axios (with interceptors + auto token refresh)
- Recharts (Area, Bar, Pie, Line charts)
- Framer Motion
- React Markdown
- React Hot Toast
- Lucide React

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- bcryptjs
- Multer (file uploads)
- Helmet + CORS + Rate Limiting
- Morgan (logging)

### AI Service
- Python 3.10+
- FastAPI + Uvicorn
- LangChain + LangChain-OpenAI
- ChromaDB (vector store)
- OpenAI GPT-4o + text-embedding-3-small
- PyPDF + python-docx (document parsing)

---

## 🌱 Seeded Data

The seed script creates:
- 5 demo users (all roles)
- 1 sample NGO (Shiksha Pragati Foundation)
- 8 major government schemes (PM Poshan, Samagra Shiksha, MGNREGS, NHM, PMAY, PMKVY, etc.)
- 2 active projects with budgets and impact data
- 2 beneficiary profiles

---

## 📜 Ethical AI Principles

SevaAI implements responsible AI:
- **Transparency**: All responses show source documents and confidence scores
- **Privacy**: Sensitive data encrypted; Aadhaar stored as hash only
- **Fairness**: Equal scheme recommendations regardless of caste/religion
- **Human Control**: AI recommends, humans approve all critical decisions
- **Audit Trail**: All AI interactions logged for accountability

---

## 📞 Support

Built with ❤️ for India's social sector.

*SevaAI — Seva (Service) + AI = Technology for Social Good*
