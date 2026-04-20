<div align="center">

<img src="https://img.shields.io/badge/version-2.1.0-blue?style=for-the-badge" />
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

### **Next-Gen AI Resume Screening & Career Intelligence Platform**

*Secure. Personal. Intelligent. Batch rank resumes, identify skill gaps, and generate AI-powered roadmap/cover letters — powered by LLaMA 3.3 70B via Groq.*

<br/>

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-FF6B35?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT_Secure-bc13fe?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-00f2ff?style=flat-square)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Deployment](#-live-deployment)
- [Key Features (v2.1)](#-key-features-v21)
- [Advanced Career Tools](#-advanced-career-tools)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Setup](#-project-setup)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🧠 Overview

**ResuMatch v2.1** is a production-grade AI platform designed to automate the initial screening process for recruiters and provide deep career insights for job seekers. Leveraging the blazing-fast **Groq Tensor Streaming Processor** and **LLaMA 3.3 70B**, it performs high-fidelity analysis of resumes against job descriptions in sub-second time.

The system now features **full user authentication**, meaning your analysis history is private, secure, and accessible only to you. We've moved beyond simple scores to provide complete **Career Roadmaps** and **AI-Tailored Cover Letters** for every scan.

---

## 🌐 Live Deployment

**Production URL:** [resumatch-ai-resume-screener-production.up.railway.app](https://resumatch-ai-resume-screener-production.up.railway.app)

> *Deployed on Railway with Auto-CI/CD. Ensure you have your `JWT_SECRET` set in production.*

---

## ✨ Key Features (v2.1)

| Feature | Description |
|---|---|
| 🔐 **Secure Accounts** | JWT-based authentication with Bcrypt password hashing. Private user dashboards. |
| 🗂️ **Private History** | Every analysis is saved to your account. MongoDB queries are scoped to your unique User ID. |
| 🚀 **Batch Processing** | Upload and rank up to **5 resumes at once**. The AI ranks them from best to worst match. |
| 🗺️ **Career Roadmaps** | 5-step strategic growth plan generated based on your specific skill gaps. |
| ✉️ **AI Cover Letters** | Instant, high-quality cover letters tailored to both the JD and your actual experience. |
| 📄 **PDF Reports** | Download high-fidelity analysis reports as PDFs using `jspdf` and `html2canvas`. |
| 📈 **ATS Health Check** | Dedicated score and 1-2 sentence feedback on ATS readability and keyword density. |
| ⚛️ **Neon UI/UX** | Premium Dark Mode interface with Glassmorphism, built with Framer Motion animations. |

---

## 🛠️ Advanced Career Tools

### 1. Skill Gap Heatmap
Visual breakdown of **Matched Strengths** (green) vs. **Critical Gaps** (pink). Identify exactly what tech stack keywords are missing from your resume.

### 2. Strategic Improvement Plan
AI-generated bullet points that you can copy/paste directly into your resume to increase your match score for that specific job.

### 3. Career Growth Milestone
For every scan, the AI identifies your seniority level and provides a "Roadmap" of the next technologies/certifications you need to master to bridge the gap.

---

## 🏗️ System Architecture

```
resumatch/
│
├── client/ (React + Vite)
│   ├── src/context/AuthContext.jsx   ← Auth state & Axios interceptors
│   ├── src/components/AuthPage.jsx   ← Login/Sign-up UI
│   ├── src/components/UploadForm.jsx ← Multi-file upload logic
│   └── src/components/ResultCard.jsx ← AI Results & PDF Export
│
└── server/ (Node.js + Express)
    ├── middleware/auth.js            ← JWT verification gatekeeper
    ├── routes/auth.js                ← Login/Registration endpoints
    ├── routes/analyze.js             ← AI Logic (Groq + pdf-parse)
    └── models/User.js                ← Encrypted User Schema
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Framer Motion, Axios, React-Icons, jsPDF, html2canvas.
- **Backend:** Node.js, Express, Multer (Memory Storage), pdf-parse.
- **Security:** JWT (JSON Web Tokens), Bcrypt.js (12 rounds salting).
- **AI Engine:** LLaMA 3.3 70B (via Groq SDK v0.9.0).
- **Database:** MongoDB Atlas (M0 Free Tier).
- **Deployment:** Railway (Full-stack Nixpacks).

---

## 🚀 Project Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Usman-Ifty/resumatch-ai-resume-screener.git
   cd resumatch-ai-resume-screener
   npm install && cd client && npm install && cd ../server && npm install
   ```

2. **Configure `.env` (server folder)**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   GROQ_API_KEY=your_groq_key
   JWT_SECRET=your_secret_string
   NODE_ENV=production (on Railway)
   ```

3. **Run Locally**
   ```bash
   # From root
   npm run dev
   ```

---

## 🗺️ Roadmap

- [x] JWT Authentication & Secure User Accounts
- [x] Per-user History Scoping
- [x] Batch Resume Ranking
- [x] Career Growth Roadmaps
- [x] PDF Analysis Exports
- [x] LLaMA 3.3 70B Upgrade
- [ ] Direct Resume Editing (In-browser)
- [ ] LinkedIn Profile URL Scraper
- [ ] Email Notifications for high match scores
- [ ] Dark/Light Theme Toggle

---

## 👤 Author

**Muhammad Usman Awan**
*Final Year CS Student @ FAST-NUCES (2026)*

- 💼 GitHub: [@Usman-Ifty](https://github.com/Usman-Ifty)
- 🔗 LinkedIn: [usman-awan](https://linkedin.com/in/usman-awan-a85877359)
- 🚀 Portfolio: [Coming Soon]

---

<div align="center">

**Built with ❤️ for the Dev Community**

*If this project helped you, consider giving it a ⭐ on GitHub.*

</div>
