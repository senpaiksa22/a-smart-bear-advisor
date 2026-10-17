# Contributing to A Smart Bear Advisor 🐻

Thank you for your interest in contributing to **A Smart Bear Advisor**! We welcome improvements to the platform, user experience, and technical infrastructure.

## Project Vision
A Smart Bear Advisor provides founders, operators, and startup builders with interactive, AI-driven strategic guidance grounded in the 20+ years of entrepreneurship and 213+ essays by **Jason Cohen** (founder of WP Engine and Smart Bear Software).

---

## Content Integrity Rule 🛡️
> **IMPORTANT:** The core article corpus and their Arabic translations represent the verified knowledge base of Jason Cohen's philosophy. Any proposed changes to essays or translations must preserve 100% conceptual fidelity without editorial deviation.

---

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/senpaiksa22/a-smart-bear-advisor.git
   cd a-smart-bear-advisor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Copy `.env.example` to `.env.local` and add your Gemini API Key and Supabase credentials.

4. **Run the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Code Style & Standards
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Code formatting:** Ensure code compiles cleanly with `npm run build` or `npx tsc --noEmit`.
- **Accessibility:** Ensure high contrast, keyboard navigable modals, and responsive layouts across mobile and desktop.

---

## Pull Request Guidelines
1. Create a feature branch: `git checkout -b feature/your-feature-name`.
2. Commit your changes with clear messages.
3. Push to your branch and open a Pull Request describing your changes and benefits.
