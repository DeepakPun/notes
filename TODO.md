# 🗺️ Pro Note-Taking App: Implementation Roadmap

This interactive blueprint maps out the development phases for building a professional-grade, block-based note application using **Node, Express, EJS, MongoDB, and Docker**.

---

## 🏗️ Phase 1: Environment & System Core

Establish a containerized, secure development environment with robust user management.

- [ ] **Dockerization Setup**
  - [ ] Write a multi-stage `Dockerfile` optimizing for node production builds.
  - [ ] Create a `docker-compose.yml` to orchestrate the Node app and a local MongoDB instance.
  - [ ] Set up volume persistence so local database records survive container restarts.
- [ ] **Secure Authentication Pipeline**
  - [ ] Implement Passport.js session-based authentication strategy.
  - [ ] Configure `express-session` backed by a MongoDB session store (`connect-mongo`).
  - [ ] Secure passwords in the User schema using modern hashing (`argon2` or `bcrypt`).
- [ ] **Access Guard Middleware**
  - [ ] Write global `isLoggedIn` route protection.
  - [ ] Build a database-level authorization middleware (`hasNoteAccess`) preventing cross-user data scraping.

---

## 📦 Phase 2: The Core Note Engine

Implement the high-performance structural data layout required for modern note apps.

- [ ] **Database Foundation**
  - [ ] Implement the structural JSON MongoDB schema with composite indexes.
  - [ ] Build text-search indexes over the `title` and `plainTextSummary` fields.
- [ ] **The EJS Workspace Shell**
  - [ ] Build a structural base layout (`layout.ejs`) using partial headers, sidebars, and alerts.
  - [ ] Code a responsive, collapsible sidebar fetching and displaying folder lists.
- [ ] **Block-Based Editor Integration**
  - [ ] Mount a modern editor frontend framework (e.g., Editor.js or Lexical) via client-side JavaScript.
  - [ ] Build an auto-saving controller payload that sends JSON block deltas to the backend via Fetch API.
  - [ ] Implement a backend middleware parser that strips the rich JSON layout into a raw `plainTextSummary` on every save.

---

## 🎨 Phase 3: Taxonomy & Advanced Organization

Elevate the application beyond a simple directory into an organized information engine.

- [ ] **Hierarchical Folders**
  - [ ] Create a recursive Folder model allowing subfolder structures.
  - [ ] Implement asynchronous drag-and-drop or location moves for changing note parents.
- [ ] **Tagging Matrix**
  - [ ] Build an analytical pipeline extraction that scans saving payloads to extract hashtags.
  - [ ] Build a fast tag-discovery view aggregating unique strings from the user's total library.
- [ ] **Retention Control (Trash & Archive)**
  - [ ] Code logical status updates to isolate data states (`isPinned`, `isArchived`, `isTrash`).
  - [ ] Write a scheduled background cron script (using `node-cron`) to hard-delete items inside the trash folder past 30 days.

---

## 🕸️ Phase 4: Pro Features & Network Graph

Implement features found in top-tier productivity tools.

- [ ] **Bi-Directional Graph Links**
  - [ ] Intercept internal wiki-links (e.g., `[[Note Name]]`) during editor parsing.
  - [ ] Asynchronously build and cross-reference records inside the `backlinks` and `outlinks` arrays.
- [ ] **Granular Collaboration & Sharing**
  - [ ] Create unique secure hash strings for single-note public link accessibility.
  - [ ] Set up an invite dashboard enabling direct email-sharing matching access roles (`viewer`, `editor`).
- [ ] **Full-Text Instant Search**
  - [ ] Create an API endpoint leveraging MongoDB's `$text` index to match titles or snippets.
  - [ ] Build an EJS modal dialog displaying live global queries instantly as a user types.

---

## 🚀 Phase 5: Production & Polish

Harden the codebase against performance drops, security gaps, and unexpected failures.

- [ ] **Application Sanitization**
  - [ ] Install and configure `helmet` to patch production security headers.
  - [ ] Run client side blocks through an XSS sanitizer pipeline before executing string displays.
- [ ] **Resource Optimization**
  - [ ] Wrap massive folder payloads into page chunk parameters (pagination).
  - [ ] Implement database projection filtering out heavy JSON block contents during general layout loads.
- [ ] **Unified Error & Crash Strategy**
  - [ ] Write custom, user-friendly 404/500 template fallback errors inside EJS.
  - [ ] Configure structured server logging (`winston` or `pino`) to easily monitor remote production logs.

---

## 🚀 Vercel Production Deployment Reminders

- **Environment Variables**: Do NOT push `.env.keys` to production. Instead, copy your plaintext keys (like `DB_URL`) and paste them directly into the **Vercel Dashboard > Project Settings > Environment Variables** UI.
- **Database Target**: Because Vercel is in the cloud, your local `mongodb://localhost:27017` will not work in production. You will need to spin up a free cloud database cluster on **MongoDB Atlas** and use their cloud connection string for the production environment variable.
