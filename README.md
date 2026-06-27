# Free Online Tools Platform

Welcome to the **Free Online Tools Platform** (`tools.chinmaypatil.com`). This project is designed as a highly scalable, performance-first, SEO-first, and privacy-first repository of hundreds of browser-based utilities (PDF, image, developer, text tools, calculators, and converters).

The project is designed to be maintained by **one developer assisted by AI**, utilizing a modular plug-in architecture to keep maintenance costs to a minimum and processing fully client-side.

---

## 🗺️ Repository Structure Map

This repository is divided into planning documentation and AI configuration. Below is the directory mapping of the planning infrastructure:

```
tools/
├── README.md                 # Project entry point and AI operating protocols
├── .gitignore                # System and dependency ignore patterns
├── docs/                     # Strategic and technical specifications
│   ├── vision.md             # Long-term goals, target audience, business model
│   ├── requirements.md       # Functional & non-functional constraints, features
│   ├── architecture.md       # Modular plug-in design, routing, rendering
│   ├── tech-stack.md         # Explicit tooling, configuration rules, conventions
│   ├── roadmap.md            # Milestones for setup, scaling, and domain migration
│   └── decisions.md          # Architecture Decision Records (ADRs)
└── .windsurf/                # AI Agent configuration
    ├── rules/                # Mandatory constraints (always follow first)
    │   ├── coding-standards.md
    │   ├── architecture-standards.md
    │   ├── documentation-standards.md
    │   ├── git-workflow.md
    │   ├── seo-standards.md
    │   ├── security-privacy.md
    │   └── ui-ux-standards.md
    └── skills/               # Repeatable AI workflows and checklists
        ├── project-planning.md
        ├── architecture-review.md
        ├── documentation-maintenance.md
        ├── github-workflow.md
        ├── seo-review.md
        └── implementation-planning.md
```

---

## 🤖 AI Agent Operating Protocol

As an AI coding assistant, you **MUST** follow this protocol before proposing, creating, or modifying any code in this repository:

### 1. Read the Docs First
Before beginning any task, you must read all active documentation in `/docs` that relates to your task. If there is any structural conflict between documents, [docs/architecture.md](./docs/architecture.md) holds the highest authority.

### 2. Documentation Before Code
You are **prohibited** from writing application code or executing architectural modifications before updating the relevant documentation in `/docs` and getting approval. Every change starts with the design.

### 3. Rules Over Skills
You must strictly follow the rules in `.windsurf/rules/` before applying workflows described in `.windsurf/skills/`. Rules are non-negotiable constraints.

### 4. Git & Issue Traceability
All changes must be associated with a GitHub Issue created or updated by you (utilizing GitHub MCP). You must write thorough commit messages matching Conventional Commits and generate structured Pull Requests. Automatic merging is **strictly prohibited**.

---

## 💻 Local Development Setup

To initialize and run the repository locally, execute the following commands in order:

### Prerequisites
*   Node.js (v20+ recommended)
*   pnpm (v9+ recommended)

### Setup Commands
```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm run dev

# 3. Build static export assets locally
pnpm run build

# 4. Preview the static export build locally
npx serve out
```

---

## 🔗 Documentation Index

*   **[Vision & Core Philosophy](./docs/vision.md)**: Details the user demographic, privacy commitments, and the Google AdSense business model.
*   **[Product Requirements](./docs/requirements.md)**: Lists functional specs, tool categories, and non-functional requirements (Core Web Vitals targets).
*   **[System Architecture](./docs/architecture.md)**: Defines the plug-in architecture, routing, rendering strategies, and scaling mechanisms.
*   **[Technical Stack Specification](./docs/tech-stack.md)**: Details exact dependencies (Next.js, Tailwind CSS, TypeScript, pnpm, shadcn/ui), folder structures, and configuration files.
*   **[Tool Development Framework](./docs/tool-framework.md)**: Defines the directories layout, lifecycle states, and Definition of Done checklists for new plugins.
*   **[Development Roadmap](./docs/roadmap.md)**: Outlines milestone sequences without dates or estimates.
*   **[Architecture Decisions (ADRs)](./docs/decisions.md)**: Records historic decision contexts, alternatives, and outcomes.
