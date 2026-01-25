# CivicX - Integrity & Commitment Management Platform

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-3_Flash-4285F4?logo=google)

## 🚀 Overview

**CivicX** is a next-generation **Integrity & Commitment Management Platform** designed to bridge the trust gap in modern remote and hybrid work environments. By utilizing **rule-based accountability**, CivicX provides a transparent framework to monitor professional exclusivity and personal commitments without resorting to invasive surveillance.

## ✨ Key Features

### 🔄 Dual-Mode Interface
- **Professional Dashboard** (Slate/Emerald theme): Designed for HR, Admins, and Employees to manage workforce compliance.
- **Personal Dashboard** (Indigo theme): A private space for users to track personal connections and maintain their own integrity scores.

### 🤖 AI-Powered Intelligence Hub
Powered by **Google Gemini 3 Flash**, the AI performs automated **Integrity Audits**:
- Analyzes tasks, user warnings, and historical violations.
- Generates structured reports with **Risk Levels** (Low/Medium/High).
- Provides actionable recommendations for compliance improvement.

### ⚖️ Exclusivity & Conflict Engine
- **Professional Exclusivity**: Flags instances where employees may be attempting to join multiple exclusive organizations simultaneously.
- **3-Strike System**: Implements automatic flagging after three verified compliance violations.
- **Personal Conflict Detection**: Provides alerts for conflicting exclusive personal connections to ensure commitment clarity.

### 📊 Productivity Tracking
- **Task Lifecycle Management**: Statuses include *Working*, *Temporarily Unavailable*, and *Not Working*.
- **Real-time Visibility**: Integrity status visibility for administrative users to ensure team alignment.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Utility-first Styling |
| **Framer Motion** | Animations |
| **Google Gemini AI** | Intelligence Hub Audits |
| **Vite** | Build Tool |
| **shadcn/ui** | Component Library |

## 📂 Architecture

```text
src/
├── components/
│   ├── LandingPage.tsx          # Marketing front-end
│   ├── Onboarding.tsx           # Integrity Oath flow
│   ├── ProfessionalDashboard.tsx # Workforce management + AI Hub
│   ├── PersonalDashboard.tsx     # Private commitment tracking
│   └── IntegrityMeter.tsx       # Dynamic SVG gauge
├── hooks/
│   └── useCivicXState.tsx       # Central state management
└── pages/
    └── Index.tsx                # View routing
🚦 Getting Started
Bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
🎯 Demo Flow
Click "Enter Platform" from the landing page.

Select a user profile (e.g., Sarah Chen as Admin).

Accept the Integrity Oath.

Navigate to the Intelligence Hub tab.

Run an AI Audit to see Gemini-powered insights.

📄 License
MIT License - Built with ❤️ using Google AI technology
