# 🛡️ OpsWatch: Technical Workflow & Architecture

This document defines the **actual backend flow, data relationships, and API-driven lifecycle** of OpsWatch.

---

## 🏗️ 1. Authentication & Workspace Entry

**Goal:** Get user authenticated and mapped to a workspace.

1. **Signup/Login**

   * User authenticates (JWT via cookies)
   * Initial state:

     ```txt
     user.workspace = null
     user.role = member
     ```

---

2. **Workspace Decision (MANDATORY)**

User must choose:

* **Create Workspace**

  * API: `POST /api/workspace/create`
  * User becomes:

    ```txt
    role = owner
    workspace = assigned
    ```

* **Join Workspace**

  * API: `POST /api/workspace/join`
  * Input: inviteCode
  * User becomes:

    ```txt
    role = member
    workspace = assigned
    ```

---

3. **Access Control Rule**

All core APIs require:

```txt
authenticate + requireWorkspace
```

👉 No workspace = no access to system

---

## 👥 2. Workspace System (Multi-Tenant Core)

**Goal:** Isolate companies completely.

---

### Workspace APIs

* `GET /api/workspace/me`
* `GET /api/workspace/members`
* `PATCH /api/workspace/role`
* `PATCH /api/workspace/invite-code`
* `DELETE /api/workspace`

---

### Role Model

| Role   | Permissions                              |
| ------ | ---------------------------------------- |
| Owner  | full control (delete workspace, roles)   |
| Admin  | manage incidents, assign users           |
| Member | limited access (assigned incidents only) |

---

### Data Isolation

ALL queries enforce:

```js
workspace: req.user.workspace
```

👉 No cross-company data leak

---

## 🖥️ 3. System Mapping (Services)

**Goal:** Define what system components are being monitored.

---

### Create Service

API:

```txt
POST /api/services
```

Input:

* name
* type (frontend | backend | database | infra)
* techStack[]
* environment (production | staging | dev)
* optional:

  * description
  * repoUrl
  * liveUrl

---

### Service APIs

* `GET /api/services`
* `GET /api/services/:id`
* `PATCH /api/services/:id`
* `DELETE /api/services/:id`

---

### Rules

* Service name must be unique **per workspace**
* Cannot delete service if used in any incident

---

## 🚨 4. Incident Lifecycle

**Goal:** Track system failures tied to real services.

---

### Create Incident

API:

```txt
POST /api/incidents
```

Input:

* title
* description
* severity
* **service (required)**

---

### Core Rule

👉 Incident MUST be linked to a Service
👉 No generic incidents allowed

---

### Incident APIs

* `GET /api/incidents`
* `GET /api/incidents/:id`
* `PATCH /api/incidents/:id/status`
* `PATCH /api/incidents/:id/assign`

---

### Status Flow

```txt
investigating → identified → monitoring → resolved
```

---

### Assignment Logic

* Admin / Owner → assign users
* Members → act only if assigned

---

## 🧾 5. Timeline System (Updates)

**Goal:** Maintain structured incident history.

---

### Update APIs

* `POST /api/incidents/:id/updates`
* `GET /api/incidents/:id/updates`

---

### Update Types

* log
* comment
* status_change

---

### Behavior

* Every status change → auto logged
* Manual updates → user-driven

---

## 🧠 6. AI Intelligence Layer

**Goal:** Provide meaningful incident insights.

---

### Summary

```txt
GET /api/ai/summary/:id
```

Returns:

* plain text (2–3 lines)
* no markdown

---

### Root Cause Analysis

```txt
GET /api/ai/root-cause/:id
```

Returns:

```json
[
  "Most likely cause",
  "Second possible cause",
  "Third possible cause"
]
```

---

### AI Context Injection

AI receives:

* Service:

  * name
  * type
  * techStack
  * environment
  * description

* Incident:

  * title
  * description
  * severity

* Timeline:

  * last 5 updates

---

👉 This makes AI responses **context-aware**

---

## 🌐 7. Data Flow (End-to-End)

---

### Full Flow

User →
Workspace →
Service →
Incident →
Updates →
AI

---

### Example

1. Create Service (API Server)
2. Incident created on that service
3. Timeline updated
4. AI analyzes:

   * tech stack
   * updates
   * environment

---

## 🔐 8. Security & Middleware

---

### Applied Globally

* authenticate (JWT)
* requireWorkspace
* rate limiting
* helmet + sanitization

---

### Result

✔ secure
✔ isolated
✔ production-ready

---

## 🛠️ Frontend Responsibilities

---

### Must Handle

* workspace flow (create/join)
* service selection (mandatory)
* incident dashboard
* timeline UI
* AI panel

---

### Critical UX Rules

* block UI if no workspace
* block incident creation if no service
* always show service context

---

## 🎯 Final System Identity

OpsWatch is:

👉 **A workspace-based incident management system with structured services and AI-powered analysis**

Not:

❌ generic CRUD dashboard
❌ disconnected incident tracker

---

## 🚀 Current Status

✔ Workspace system
✔ RBAC
✔ Service layer
✔ Incident system
✔ Timeline
✔ AI integration

---

## 🔜 Next Expansion (Future)

* service health monitoring
* alerts
* CI/CD integration
* deeper AI automation

---

*Built for real-world incident handling, not just demo flows.*
