<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" />
<img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />

<br/><br/>

```
██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗ █████╗ ████████╗ ██████╗██╗  ██╗
██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔══██╗╚══██╔══╝██╔════╝██║  ██║
██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║███████║   ██║   ██║     ███████║
██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██║     ██╔══██║
██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗██║  ██║
╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

### **AI-Powered Resume Screener — Built on the MERN Stack**

*Upload your resume. Paste a job description. Get an instant AI match score, skill gap analysis, and reasoning — powered by LLaMA 3 70B via Groq.*

<br/>

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3_70B-FF6B35?style=flat-square)
![Multer](https://img.shields.io/badge/Multer-File_Upload-blueviolet?style=flat-square)
![pdf--parse](https://img.shields.io/badge/pdf--parse-Text_Extraction-red?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [AI Prompt Design](#-ai-prompt-design)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🧠 Overview

**ResuMatch** is a full-stack AI resume screening tool that bridges the gap between job seekers and hiring requirements. The application accepts a resume in PDF format and a raw job description, extracts the resume text server-side, and submits both to the **Groq API** running **LLaMA 3 70B** — one of the fastest and most capable open-source large language models available today.

The AI returns a structured evaluation containing:
- A **match score** from 0 to 100
- A **verdict label** (Strong Match / Good Match / Partial Match / Weak Match)
- A list of **matched skills** already present in the resume
- A list of **missing skills** the candidate should develop or highlight
- A **natural-language reasoning paragraph** explaining the score

Every analysis is persisted in **MongoDB** with a timestamp, making the backend queryable for analytics and history features.

This project was built to demonstrate production-level full-stack development — not a toy project. It handles real PDF binary buffers, parses unstructured text, engineers prompts for reliable structured AI output, and manages async data flow across a React frontend, an Express REST API, and a cloud database.

---

## 🌐 Live Demo

> 🚧 Deployment in progress — link will be updated here once live on Render + Vercel.

To run it locally right now, follow the [Getting Started](#-getting-started) section below. Setup takes under 10 minutes.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **PDF Upload** | Drag-and-drop or click-to-browse PDF upload with client-side type and size validation |
| 🔍 **Text Extraction** | Server-side PDF text extraction via `pdf-parse` — works on any text-based PDF |
| 🤖 **LLM Analysis** | LLaMA 3 70B via Groq API returns a structured JSON evaluation of resume vs. job description |
| 📊 **Match Score** | Integer score from 0–100 with animated SVG ring visualization |
| 🏷️ **Verdict Label** | Strong Match / Good Match / Partial Match / Weak Match based on score thresholds |
| ✅ **Matched Skills** | Skills already present in the resume that align with the job description |
| ❌ **Missing Skills** | Skills required by the job that are absent from the resume |
| 💬 **AI Reasoning** | 2–3 sentence natural-language explanation of why the score was assigned |
| 🗄️ **Persistence** | Every analysis saved to MongoDB with full resume text, JD, result, and timestamp |
| ♻️ **Reset Flow** | One-click reset to analyze a new resume without reloading the page |

---

## ⚙️ How It Works

The application follows a clean 6-step pipeline from user action to rendered result:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ResuMatch Pipeline                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. USER                                                                │
│     └─► Uploads resume PDF + pastes job description in React UI         │
│                                                                         │
│  2. REACT FRONTEND                                                      │
│     └─► Validates file type (PDF only) and size (max 5MB)              │
│         Sends multipart/form-data POST to Express API                   │
│                                                                         │
│  3. EXPRESS BACKEND — Multer                                            │
│     └─► Receives the file buffer in memory (no disk write)              │
│         Passes buffer to pdf-parse for text extraction                  │
│                                                                         │
│  4. EXPRESS BACKEND — Groq API                                          │
│     └─► Constructs structured prompt with resume text + JD              │
│         Calls llama3-70b-8192 with temperature=0.2 for consistency      │
│         Extracts JSON block from LLM response                           │
│                                                                         │
│  5. EXPRESS BACKEND — MongoDB                                           │
│     └─► Saves full analysis document (score, skills, reasoning, text)  │
│         Returns result JSON to frontend                                 │
│                                                                         │
│  6. REACT FRONTEND                                                      │
│     └─► Renders animated score ring, verdict badge, skills grid,       │
│         and reasoning paragraph                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
resumatch/
│
├── client/                        ← React + Vite (Frontend)
│   └── src/
│       ├── App.jsx                ← Root component, state management
│       ├── main.jsx               ← React DOM entry point
│       ├── index.css              ← Global styles (dark theme)
│       └── components/
│           ├── UploadForm.jsx     ← PDF drag-drop + JD textarea + submit
│           └── ResultCard.jsx     ← Score ring + verdict + skills + reasoning
│
└── server/                        ← Node.js + Express (Backend)
    ├── index.js                   ← App entry — Express setup + MongoDB connect
    ├── .env                       ← Secret keys (never committed)
    ├── routes/
    │   └── analyze.js             ← POST /api/analyze — core logic:
    │                                  Multer → pdf-parse → Groq → MongoDB → response
    └── models/
        └── Analysis.js            ← Mongoose schema for persisted analyses
```

### Data Flow Diagram

```
React UI
   │
   │  POST /api/analyze
   │  multipart/form-data
   │  { resume: <PDF buffer>, jobDescription: <string> }
   ▼
Express Router (/api/analyze)
   │
   ├── Multer (memoryStorage)
   │     └── req.file.buffer ──► pdf-parse ──► resumeText (string)
   │
   ├── Prompt Engineering
   │     └── { resumeText + jobDescription } ──► structured prompt string
   │
   ├── Groq API (llama3-70b-8192)
   │     └── LLM response ──► JSON.parse() ──► { score, verdict, skills, reasoning }
   │
   ├── MongoDB (via Mongoose)
   │     └── new Analysis({ ... }).save()
   │
   └── res.json({ score, verdict, matchedSkills, missingSkills, reasoning, analysisId })
           │
           ▼
       React UI renders ResultCard
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | Component-based UI with hooks |
| Vite | 5.x | Fast dev server and build tool |
| Axios | 1.6 | HTTP client for API calls |
| CSS3 | — | Custom dark theme, animations, SVG score ring |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express | 4.18 | REST API framework |
| Multer | 1.4.5-lts | Multipart file upload handling |
| pdf-parse | 1.1.1 | PDF buffer → plain text extraction |
| groq-sdk | 0.3.3 | Official Groq API client |
| Mongoose | 8.2 | MongoDB ODM with schema validation |
| dotenv | 16.x | Environment variable management |
| cors | 2.8 | Cross-origin request handling |

### AI
| Model | Provider | Why |
|---|---|---|
| `llama3-70b-8192` | Groq | Fastest inference on LLaMA 3 70B — free tier available, sub-second response, reliable JSON output |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL — stores each analysis with full text + result |
| Mongoose | Schema enforcement, validation, timestamps |

---

## 📁 Project Structure

```
resumatch/
│
├── README.md
│
├── server/
│   ├── .env                    ← PORT, MONGO_URI, GROQ_API_KEY
│   ├── .gitignore
│   ├── package.json
│   ├── index.js                ← Express app, MongoDB connection, route mounting
│   ├── routes/
│   │   └── analyze.js          ← Full analysis pipeline
│   └── models/
│       └── Analysis.js         ← Mongoose schema
│
└── client/
    ├── index.html              ← Vite entry HTML
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx            ← ReactDOM.createRoot()
        ├── App.jsx             ← State: result, loading, error
        ├── index.css           ← All styles
        └── components/
            ├── UploadForm.jsx  ← File upload + JD input + form submit
            └── ResultCard.jsx  ← Score ring + skills + reasoning display
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- A free **Groq API key** — [Get one here](https://console.groq.com) (no credit card required)
- A free **MongoDB Atlas** account — [Sign up here](https://cloud.mongodb.com) (free M0 cluster)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Usman-Ifty/resumatch-ai-resume-screener.git
cd resumatch-ai-resume-screener
```

**2. Install server dependencies**

```bash
cd server
npm install
```

**3. Install client dependencies**

```bash
cd ../client
npm install
```

---

### Environment Variables

Create a `.env` file inside the `server/` folder:

```bash
# server/.env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/resumatch
GROQ_API_KEY=gsk_your_groq_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

**How to get each value:**

| Variable | Where to get it |
|---|---|
| `PORT` | Leave as `5000` unless that port is in use |
| `MONGO_URI` | MongoDB Atlas → your cluster → Connect → Drivers → copy the connection string |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys → Create API Key |

---

### Running the App

You need **two terminals** running simultaneously.

**Terminal 1 — Start the backend:**

```bash
cd resumatch/server
node index.js
```

Expected output:
```
MongoDB connected
Server running on port 5000
```

**Terminal 2 — Start the frontend:**

```bash
cd resumatch/client
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. The app is live.

---

## 📡 API Reference

### `POST /api/analyze`

Analyzes a resume PDF against a job description.

**Request**

```
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `resume` | File (PDF) | ✅ | Resume file — PDF only, max 5MB |
| `jobDescription` | String | ✅ | Raw text of the job description, min 20 chars |

**Success Response** — `200 OK`

```json
{
  "score": 78,
  "verdict": "Good Match",
  "matchedSkills": ["Python", "React", "Node.js", "MongoDB", "REST API"],
  "missingSkills": ["Docker", "Kubernetes", "AWS"],
  "reasoning": "The candidate demonstrates strong proficiency in the core web stack and Python, which aligns well with the role requirements. However, the job requires production-level DevOps experience with Docker and cloud infrastructure that is not evident in the resume.",
  "analysisId": "65f3a2c1d4e8b10012a4f7c9"
}
```

**Error Responses**

| Status | Condition | Message |
|---|---|---|
| `400` | No PDF uploaded | `"No resume PDF uploaded."` |
| `400` | JD too short | `"Job description is too short."` |
| `400` | PDF has no extractable text | `"Could not extract text from PDF. Make sure it is not a scanned image."` |
| `500` | Groq returned malformed JSON | `"AI returned an unexpected format. Please try again."` |
| `500` | Any other server error | `"Something went wrong. Please try again."` |

---

### `GET /`

Health check endpoint.

**Response** — `200 OK`

```json
{ "message": "ResuMatch API is running" }
```

---

## 🗄️ Database Schema

Each analysis is stored in the `analyses` collection in MongoDB.

```javascript
// models/Analysis.js

{
  resumeText:    String,   // Extracted PDF text (capped at 3000 chars for storage)
  jobDescription: String,  // Raw JD input (capped at 2000 chars)
  score:         Number,   // Integer 0–100
  verdict:       String,   // Enum: 'Strong Match' | 'Good Match' | 'Partial Match' | 'Weak Match'
  matchedSkills: [String], // Array of matched skill strings
  missingSkills: [String], // Array of missing skill strings
  reasoning:     String,   // AI-generated explanation paragraph
  createdAt:     Date,     // Auto-generated by Mongoose timestamps: true
  updatedAt:     Date      // Auto-generated by Mongoose timestamps: true
}
```

**Example MongoDB document:**

```json
{
  "_id": "65f3a2c1d4e8b10012a4f7c9",
  "score": 78,
  "verdict": "Good Match",
  "matchedSkills": ["Python", "React", "Node.js", "MongoDB"],
  "missingSkills": ["Docker", "AWS"],
  "reasoning": "Strong alignment on the core stack...",
  "resumeText": "Muhammad Usman Awan...",
  "jobDescription": "We are looking for a full-stack engineer...",
  "createdAt": "2025-04-19T08:30:00.000Z",
  "updatedAt": "2025-04-19T08:30:00.000Z",
  "__v": 0
}
```

---

## 🤖 AI Prompt Design

The prompt sent to LLaMA 3 70B is carefully engineered for consistent, parseable output. Key design decisions:

**1. Role assignment** — The model is told it is an expert ATS and technical recruiter, which grounds the evaluation in a professional context and produces more relevant skill identification.

**2. Low temperature (0.2)** — Keeps the output deterministic and structured. Higher temperatures caused the model to occasionally add prose before/after the JSON block.

**3. Explicit JSON schema** — The prompt specifies the exact JSON keys and value types expected. This prevents the model from inventing its own format.

**4. Defensive parsing** — The backend uses a regex to extract the JSON block (`/\{[\s\S]*\}/`) before parsing. This handles cases where the model prepends a short sentence before the JSON.

**5. Input truncation** — Resume text is capped at 4000 characters and JD at 2000 characters to stay within token limits while preserving the most relevant information.

```
Prompt structure:

  [Role assignment]
    "You are an expert ATS and technical recruiter..."

  [Task instruction]
    "Analyze the following resume against the job description
     and return a JSON response ONLY..."

  [Resume text — up to 4000 chars]

  [Job description — up to 2000 chars]

  [Exact JSON schema to return]
    {
      "score": <integer 0-100>,
      "verdict": "<Strong Match | Good Match | Partial Match | Weak Match>",
      "matched_skills": [...],
      "missing_skills": [...],
      "reasoning": "<2-3 sentences>"
    }
```

---

## 📸 Screenshots

> Screenshots will be added after the first live deployment. The UI features a dark theme with an animated SVG score ring, color-coded skill tags (green for matched, red for missing), and a verdict badge.

---

## 🗺️ Roadmap

- [x] PDF upload and text extraction
- [x] Groq LLM integration with structured JSON output
- [x] MongoDB persistence with Mongoose
- [x] Animated score ring and skill breakdown UI
- [ ] Analysis history page (view past analyses from MongoDB)
- [ ] Improvement suggestions (additional AI feature per analysis)
- [ ] ATS keyword density heatmap
- [ ] Multi-resume batch upload
- [ ] Export results as PDF report
- [ ] Deploy to Render (backend) + Vercel (frontend)
- [ ] Rate limiting and request throttling

---

## 👤 Author

**Muhammad Usman Awan**

- 🎓 BS Computer Science — FAST-NUCES Faisalabad (Graduating June 2026)
- 💼 GitHub: [github.com/Usman-Ifty](https://github.com/Usman-Ifty)
- 🔗 LinkedIn: [linkedin.com/in/usman-awan](https://linkedin.com/in/usman-awan-a85877359)
- ✍️ Medium: [@muawan125](https://medium.com/@muawan125)

---

## 📄 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute this project with attribution.

```
MIT License

Copyright (c) 2025 Muhammad Usman Awan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

**Built with Node.js · React · MongoDB · Groq · LLaMA 3**

*If this project helped you, consider giving it a ⭐ on GitHub.*

</div>
