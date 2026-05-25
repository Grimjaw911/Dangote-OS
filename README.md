# Dangote Predictive Maintenance & Surveillance OS

Enterprise-grade AI-powered industrial operations platform for cement plants, manufacturing facilities, logistics yards, and power plants.

## Demo Login

| Email | Role | Password |
|-------|------|----------|
| admin@dangote.com | Admin | admin123 |
| engineer@dangote.com | Maintenance Engineer | admin123 |
| security@dangote.com | Security Officer | admin123 |

## Quick Start

```bash
npm install
cp .env.example .env.local  # add your Supabase credentials
npm run dev
```

Run the SQL in `supabase/schema.sql` in your Supabase project.

## Modules

- **Command Center** — Global ops overview, live KPIs, AI insights
- **AI Surveillance** — Canvas-simulated camera feeds, AI detection overlays, PPE/fire/intrusion alerts
- **Predictive Maintenance** — Equipment health, sensor charts, anomaly detection, work orders
- **Incident Management** — AI-generated summaries, escalation, timeline
- **Analytics** — Production, safety, energy, maintenance dashboards
- **Reports** — PDF/Excel generation, scheduled reports
- **AI Assistant** — DangoteAI chatbot with industrial knowledge
- **User Management** — RBAC with 6 operational roles

## Tech Stack

Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui, Framer Motion, Recharts, Zustand, Supabase, TensorFlow.js

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
