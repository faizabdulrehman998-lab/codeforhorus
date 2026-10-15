# AGENTS.md

## Project Overview
- **Goal:** Start a software company with a developer friend. The friend will take clients from his previous job and we'll help them ship apps quickly using AI‑augmented development.
- **Roles:**
  - **You (founder/market):** Client relationships, sales, product vision, UX feedback, approval of deliverables.
  - **Friend (developer/tech):** Architecture, code quality, CI/CD, deployment, scaling.
  - **AI (OpenCode agent):** Pair‑programmer / analyst / DevOps helper — generates code, writes tests, suggests stacks, automates routine bash tasks, researches solutions.
- **First product:** Minimal viable SaaS landing‑page + simple backend for one of the friend's ex‑clients. Scope: 2‑4 weeks, shipable, then iterate.

## Technology Stack
- **Frontend:** React + Vite (modern, fast, AI‑friendly).
- **Backend/Database:** Supabase (PostgreSQL, auth, storage — hosted, AI‑friendly, includes free tier).
- **Deployments:** Vercel (frontend) + Supabase dashboard (backend). Both have generous free tiers and integrate well with React.
- **AI Context:** This repo + `opencode` session. I (the agent) have read/write access to this repo and can run bash commands (with your approval for state‑changing actions).

## Developer Workflow (OpenCode)

### Primary agents (cycle with **Tab**)
- **`build`** — full tools enabled. Used for implementation, file edits, bash.
- **`plan`** — read‑only analysis. Used for planning, reviewing code, suggesting changes without modifying.

### Sub‑agents (invoke with `@subagent_name`)
- **`@general`** — general‑purpose, can edit, run multi‑step tasks.
- **`@explore`** — fast read‑only search, cannot modify files.
- **`@scout`** — external docs/dependency research, read‑only.

### Built‑in sub‑agents (always available)
- **`@title`**, **`@summary`**, **`@compaction`** — hidden system agents.

### Key commands you'll use
| Command | Purpose |
|---------|---------|
| `opencode run "prompt"` | Non‑interactive run (good for scripts/quick tasks). |
| `opencode run -c "continue"` / `-s <id>` | Resume a previous session. |
| `opencode agent create` | Create a custom agent (wizard). |
| `opencode agent list` | List available agents. |
| `opencode models` | List valid `provider/model` IDs. |
| `opencode serve` | Headless backend; then `opencode attach` or `opencode web` for UI. |
| `opencode` (no args) | TUI: Tab cycles primary agents, `@agent` invokes sub‑agents. |

### Permission gates (safety)
- **`git push`**, **`npm publish`**, **`vercel deploy`** etc. are set to **`ask`** by default. I will never run a state‑changing command without your explicit approval.
- **`file edits`** — also `ask` by default. I’ll show you diffs before writing.
- You can override per‑agent in `opencode.json` if you want stricter/looser rules.

### Typical session flow
1. **You describe the task** (e.g., "Create a landing‑page for Client X with a signup form that saves to Supabase").
2. **I (agent)** plan the implementation, list files to create/modify, and ask for approval on any `git push`/`bash` that changes state.
3. **You approve** (or request changes).
4. **I implement**, commit, and push (after your go‑ahead).
5. **You review the diff** on GitHub, test the live URL, and give feedback.

## First Sprint (2‑week goal)
- **Week 1:** Scaffold React + Vite app, integrate Supabase Auth, create basic landing‑page UI (hero, features, signup), write `README.md` and `AGENTS.md` (this file).
- **Week 2:** Connect form to Supabase, deploy to Vercel, demo to client, retro‑fit the workflow (adjust `AGENTS.md` if needed).

## How to Use This File
- Keep it updated as the stack or roles evolve.
- Review it at the start of each new client project; copy/modify for each new app.
- If you add new sub‑agents or change stacks, update the "Primary agents" and "Tech Stack" sections.

---

**Happy building!** Ask me to explain any section, generate boilerplate, or run a command — I'm here to reduce the friction from "idea" to "shippable product."