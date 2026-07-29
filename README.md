# Kutumb Advisory

A premium family wealth advisory platform built with Next.js.

## Overview

Kutumb Advisory is a beautifully crafted marketing website for a premium Family Wealth Advisory service. It presents the brand's philosophy of treating family wealth as a holistic ecosystem through the metaphor of a "Financial Kundali" — moving beyond traditional financial products to comprehensive financial architecture.

## Features

- **Premium marketing website** — Full brand experience with navy, gold, and ivory design system
- **Financial Kundali** — Interactive 9-Graha grid representing holistic wealth dimensions
- **About page** — Philosophy, founder story, team showcase, and trust signals
- **Contact experience** — Multi-step consultation booking form with validation
- **Family Wealth Journal** — Article library with categories, featured stories, and guides
- **Responsive design** — Fully responsive across all device sizes
- **Motion animations** — Framer Motion powered scroll and hover animations
- **Premium design system** — Consistent typography (Playfair Display + Inter), colours, and component library

## Tech Stack

- **Next.js 16** — App Router, React Server Components
- **React 19** — Modern React patterns
- **TypeScript** — Type safety throughout
- **Tailwind CSS v4** — Utility-first styling with PostCSS
- **Framer Motion** — Declarative animations

## Local Development

```bash
npm install
npm run dev
```

The development server starts at [http://localhost:3000](http://localhost:3000).

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── about/        # About page
│   ├── contact/      # Contact page with multi-step form
│   └── journal/      # Family Wealth Journal
├── components/       # Reusable UI components
│   ├── icons/        # SVG icon library
│   └── ...           # Page-specific components
├── lib/              # Utilities and data
└── types/            # TypeScript type definitions
```

## Status

- **Frontend** — Complete. All pages render with full UI, animations, and responsive layout.
- **Journal articles** — Pending. Article data exists but individual article routes are not yet implemented.
- **Backend & CMS** — Planned. Contact form submission, newsletter signup, and article management require backend integration.
