# everything_ai_develop

A comprehensive breakdown of the core architectural skills, behaviors, and guardrails driving our autonomous engineering agents.
                                      # everything_ai_develop

A comprehensive breakdown of the core architectural skills, behaviors, and guardrails driving our autonomous engineering agents.

---

## 🏗️ Framework Architecture

```text
                                              ┌──────────────────────────────────────┐
                                              │         Developer Application        │
                                              └──────────────────┬───────────────────┘
                                                                 │ Uses SDK / API
                                                                 ▼
                                ┌─────────────────────────────────────────────────────────────────────────┐
                                │                       everything-ai-develop Core                        │
                                ├───────────────┬───────────────────┬───────────────────┬─────────────────┤
                                │  🧠 The Brain │   ✍️ The Hands     │    👁️ The Eyes     │  🛡️ The Shield  │
                                │ (Context/AST) │ (Code Gen/Shell)  │ (Sandbox/Runtime) │ (Guardrails/PII)│
                                └───────┬───────┴─────────┬─────────┴─────────┬─────────┴────────┬────────┘
                                        │                 │                   │                  │
                                        ▼                 ▼                   ▼                  ▼
                                 [Vector DB / Git]  [LSP / Terminal]  [Docker / E2B SDK]  [AgentShield/LLM]
```

---

## 1. Codebase Awareness & Context Skills (The "Brain")
These skills dictate how the AI gathers information from a repository without blowing past context token limits.

*   **Semantic Repository Search:** Uses vector embeddings to scan the codebase and locate relevant functions based on meaning rather than exact keyword matches.
*   **AST (Abstract Syntax Tree) Parsing:** Maps code hierarchies to understand structural relationships (e.g., finding where a class is defined, inherited, or imported across files).
*   **Git History Tracking:** Analyzes recent commit messages and blame files to understand *why* changes were made, ensuring new code matches historical styles.
*   **Active Window Tracking:** Tracks the user’s cursor position, open editor tabs, and highlighted lines in real-time to generate immediate, context-aware suggestions.
*   **Automated Rules Ingestion:** Automatically reads and updates local instruction files (like `.cursorrules` or `CLAUDE.md`) to dynamically adjust its coding behavior per project.

---

## 2. Implementation & Autocomplete Skills (The "Hands")
These skills focus on generating functional, clean code at maximum speed.

*   **Fill-In-The-Middle (FIM) Completions:** Predicts and streams code snippets right inside an open block by looking at both the code above and below the cursor.
*   **Multi-File Refactoring:** Modifies several files simultaneously (e.g., updating a database schema file and changing the API routes that depend on it in one go).
*   **Natural Language to Shell Execution:** Translates plain English commands into complex, safely structured terminal syntax (e.g., converting *"find all large log files and zip them"* into a bash command).
*   **Boilerplate & Test Generation:** Generates comprehensive structural templates, mock data, and unit tests using frameworks like Jest, PyTest, or Vitest.
*   **Package Dependency Management:** Identifies missing libraries during code creation, safely checks for safe package versions, and installs them using local package managers (`npm`, `pip`, `cargo`).

---

## 3. Execution & Verification Skills (The "Eyes")
These skills interact with live execution runtimes to evaluate code validity.

*   **Isolated Sandbox Execution:** Safely runs newly written code or setup scripts inside secure, isolated environments like Docker or E2B Sandboxes.
*   **Terminal Output Stream Monitoring:** Listens to live `stdout`/`stderr` streams to instantly capture compiling warnings, syntax blocks, or execution crashes.
*   **Self-Healing & Auto-Debugging:** Catches an execution error trace from the terminal, feeds the stack trace back into its reasoning loop, and writes a patch automatically.
*   **Live Web Preview Hosting:** Launches background preview servers (like Vite or Next.js) and exposes hot-reloading ports to let developers interactively review UI/UX components.
*   **Browser-in-the-Loop Testing:** Uses automated headless browsers (like Playwright or Puppeteer) to visually interact with pages, take screenshots, and verify front-end flows.

---

## 4. Enterprise & Guardrail Skills (The "Shield")
These skills ensure that autonomous AI tools do not cause damage or leak internal information.

*   **Static Security Linting (AgentShield Logic):** Scans files for exposed API keys, hardcoded passwords, or insecure dependencies before letting the AI run code.
*   **Prompt Injection Protection:** Intercepts untrusted repository files or raw user input to screen for hidden commands designed to override the AI's core instructions.
*   **Privacy & PII Masking:** Filters out Personally Identifiable Information (PII) or proprietary internal data before transmitting prompt payloads to cloud LLM endpoints.
*   **Token Optimization Routing:** Calculates task complexity and dynamically routes work—sending short inline completions to lightning-fast models (like Claude Haiku) and deep logic bugs to reasoning heavyweights (like OpenAI o1 or DeepSeek-R1).
