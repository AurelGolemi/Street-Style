# 🛍️ Street Style — Modern E-Commerce Web Application

🔗 Live Demo: https://street-style-iota.vercel.app

Street Style is a fully responsive e-commerce web application built with Next.js 15 (App Router) and TypeScript.  
The project focuses on performance, scalability, internationalization, analytics integration, and modern UI architecture.

---

## 🚀 Overview

The goal of this project was to simulate a real-world streetwear e-commerce platform while implementing production-level frontend patterns including:

- App Router architecture
- Server & Client Component separation
- Cart state management
- Internationalized routing
- SEO & structured metadata
- Google Analytics 4 with Consent Mode

---

## 🛠 Tech Stack

Framework:
- Next.js 15+ (App Router)

Frontend:
- React
- TypeScript
- Tailwind CSS

Internationalization:
- next-intl

Analytics:
- Google Analytics 4
- Consent Mode

Deployment & CI/CD:
- Vercel

---

## ✨ Core Features

🧾 Dynamic Product Listings  
- Responsive product grid layout  
- Structured product data  

🛒 Cart System  
- Real-time cart state updates  
- Add / remove item functionality  
- Client-side state management  

🌍 Internationalization (i18n)  
- Multi-language routing  
- Dynamic locale switching  

🔍 SEO Optimization  
- Dynamic metadata  
- Open Graph tags  
- Structured schema  

📊 Analytics Integration  
- GA4 event tracking  
- Consent-based analytics configuration  

📱 Fully Responsive  
- Mobile-first Tailwind implementation  

---

## 🧠 Architecture Highlights

- App Router with nested layouts
- Separation of server and client components
- Modular component structure (UI / Layout / Feature components)
- Type-safe product models using TypeScript
- Scalable folder organization for maintainability
- Optimized image handling via Next.js Image component

---

## 📂 Project Structure (Simplified)
app/
components/
lib/
public/


- `app/` → Routes & layout structure
- `components/` → Reusable UI and feature components
- `lib/` → Utility functions and shared logic

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/AurelGolemi/street-style
cd street-style
npm install
npm run dev
Then open https://localhost:3000
