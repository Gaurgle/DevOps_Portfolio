![Status](https://img.shields.io/badge/Status-Active-success)
![GitHub last commit](https://img.shields.io/github/last-commit/Gaurgle/DevOps_Portfolio)
![Frontend](https://img.shields.io/badge/Frontend-Astro-FF5A03?logo=astro)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)

[![Frontend Demo](https://img.shields.io/badge/Frontend-Demo-blue?logo=vercel)](https://andreasroos.vercel.app)
[![Backend Health](https://img.shields.io/badge/Backend-Health_Check-success?logo=springboot)](https://devopsportfolio-production.up.railway.app/actuator/health)

# DevOps Portfolio
This is a showcase portfolio application built as a part of the DevOps course at Nackademin.
A full-stack developer portfolio built with **Astro (frontend)** and **Spring Boot (backend)**, connected to a **PostgreSQL database** on **Render** and deployed using **Vercel**, **Railway**, and **GitHub Actions**.

---
## 📖 Documentation

- [Frontend README →](https://github.com/Gaurgle/DevOps_Portfolio/blob/main/portfolio_FE/README.md)
- [Backend README →](https://github.com/Gaurgle/DevOps_Portfolio/blob/main/portfolio_BE/README.md)

---

## 🌍 Live Demo
- **Frontend (Portfolio site)** → [https://andreasroos.vercel.app](https://andreasroos.vercel.app)
- **Backend (API)** → [https://devopsportfolio-production.up.railway.app/actuator/health](https://devopsportfolio-production.up.railway.app/actuator/health)

---

## 📁 Project Structure

```text
DevOps_Portfolio/
├── portfolio_FE/    → Astro frontend (Vercel)
└── portfolio_BE/    → Spring Boot backend (Railway)
```

---

## ⚙️ Tech Stack
**Frontend:** Astro, Tailwind CSS, TypeScript  
**Backend:** Spring Boot (Kotlin), JPA, Flyway, PostgreSQL  
**Infrastructure:** Vercel, Railway, Render, GitHub Actions  
**Email:** Resend API (via backend service)  
**Database:** PostgreSQL (Render)  

---

## 🧩 Features
- Responsive portfolio built in Astro
- Dynamic projects list
- Contact form → backend API
- Saves messages in PostgreSQL DB
- Sends email via Resend
- CI/CD pipelines for both FE & BE
- Backend unit tests validated on each push

---

## 🔄 CI/CD Overview
| Component | Platform | Trigger | Result |
|------------|-----------|----------|----------|
| **Backend** | GitHub Actions + Railway | Push to `main` | Runs tests → deploys if all pass |
| **Frontend** | Vercel | Push to `main` | Auto-deploys new build |
| **Database** | Render | Always-on Postgres instance |

---

## 🧪 Local Development
### Frontend
```bash
cd portfolio_FE
npm install
npm run dev
```

### Backend
```bash
cd portfolio_BE
export SPRING_PROFILES_ACTIVE=local
./gradlew bootRun
```

##### Run all backend tests:
```bash
./gradlew test
```


---
