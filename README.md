<div align="center">

<img src="https://img.shields.io/badge/version-2.2.0-blue?style=for-the-badge" />
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

### **Premium AI Resume Screening & Career Intelligence Dashboard**

*Secure. Analytical. Personal. Batch rank resumes, track your progress with live analytics, and generate AI-powered roadmap/cover letters — powered by LLaMA 3.3 70B via Groq.*

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
- [Key Features (v2.2)](#-key-features-v22)
- [Dashboard & Analytics](#-dashboard--analytics)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Project Setup](#-project-setup)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🧠 Overview

**ResuMatch v2.2** is a production-grade AI platform designed to automate the initial screening process for recruiters and provide deep career insights for job seekers. Leveraging the blazing-fast **Groq Tensor Streaming Processor** and **LLaMA 3.3 70B**, it performs high-fidelity analysis of resumes against job descriptions in sub-second time.

The system now features **full user authentication**, meaning your analysis history is private, secure, and accessible only to you. We've introduced a **Premium Dashboard Hub** that tracks your career progress through live analytics.

---

## 🌐 Live Deployment

**Production URL:** [resumatch-ai-resume-screener-production.up.railway.app](https://resumatch-ai-resume-screener-production.up.railway.app)

---

## ✨ Key Features (v2.2)

| Feature | Description |
|---|---|
| 🔐 **Secure Accounts** | JWT-based authentication with Bcrypt password hashing. Branded Login/Signup interface. |
| 📊 **Live Analytics Hub** | Real-time tracking of total scans, average match score, and primary competitive status. |
| 🗂️ **Private History** | User-scoped database architecture ensures your resumes are never visible to others. |
| 🚀 **Batch Processing** | High-speed batch ranking of up to **5 resumes at once**. |
| 📖 **Interactive Guide** | Built-in step-by-step onboarding guide for new users in the dashboard. |
| ✉️ **AI Career Suite** | Instant AI-tailored Cover Letters and 5-step strategic Career Roadmaps. |
| 📄 **Professional Reports** | Download beautiful, high-fidelity PDF analysis reports for offline review. |

---

## 📈 Dashboard & Analytics

The new **Dashboard Hub** serves as your mission control center:
- **Total Scans:** Tracks every resume analyzed throughout your career journey.
- **Average Match %:** Aggregated performance data across all your applications.
- **Primary Status:** AI labels your current market competitiveness (e.g., "Good Match").
- **Pro-Tips:** Dynamic tactical advice tailored to help you land more interviews.

---

## 🏗️ System Architecture

```
resumatch/
│
├── client/ (React + Vite)
│   ├── src/context/AuthContext.jsx   ← Secure state & token mgmt
│   ├── src/components/AuthPage.jsx   ← Branded Entry Portal
│   ├── src/components/DashboardHub.jsx ← Analytics & Progress Tracking
│   ├── src/components/UploadForm.jsx ← Multi-file processing
│   └── src/components/ResultCard.jsx ← Career Insights & PDF Export
│
└── server/ (Node.js + Express)
    ├── middleware/auth.js            ← JWT verification gatekeeper
    ├── routes/auth.js                ← Encrypted Auth endpoints
    ├── routes/analyze.js             ← AI Logic (Groq + pdf-parse)
    └── models/User.js                ← PII Secured User Schema
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Framer Motion, Axios, React-Icons, jsPDF, html2canvas.
- **Backend:** Node.js, Express, Multer, pdf-parse, JWT, Bcrypt.js.
- **AI Engine:** LLaMA 3.3 70B (via Groq SDK v0.9.0).
- **Database:** MongoDB Atlas (M0 Free Tier).

---

## 🚀 Project Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Usman-Ifty/resumatch-ai-resume-screener.git
   cd resumatch-ai-resume-screener
   npm run dev
   ```

2. **Required Environment Variables**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   GROQ_API_KEY=your_groq_key
   JWT_SECRET=your_secret_string
   NODE_ENV=production
   ```

---

## 🗺️ Roadmap

- [x] JWT Authentication & Secure User Accounts
- [x] Live Analytics Dashboard Hub
- [x] Interactive User Guide & Pro-Tips
- [x] Batch Resume Ranking
- [x] Career Growth Roadmaps
- [x] PDF Analysis Exports
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

---

<div align="center">

**Built with ❤️ for the Dev Community**

*If this project helped you, consider giving it a ⭐ on GitHub.*

</div>
