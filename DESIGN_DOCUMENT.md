# Butterscribe - Architecture & Design Document

## 1. Project Overview

**Butterscribe** is a Next.js 15 (App Router) based full-stack application designed as a modern SEO Content Management SaaS platform. It provides tools for content creation, team approvals, keyword analysis, and content library management, featuring a fully functional rich text editor powered by Tiptap and AI-assisted workflows.

## 2. Technology Stack

- **Framework**: Next.js 15.3 (App Router, Turbopack)
- **Frontend/Styling**: React 19, Tailwind CSS 4, Radix UI, Base UI (`@base-ui/react`), and custom `shadcn`-inspired components.
- **Rich Text Editor**: Tiptap (`@tiptap/react`, `@tiptap/starter-kit`)
- **Icons**: Lucide React & HugeIcons
- **State Management**: Zustand
- **Database & ORM**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (v4) using JWT strategy and Credentials Provider (with `bcryptjs`).
- **Validation**: React Hook Form with Zod schema validation.

## 3. Project Structure

The codebase strictly follows a feature-module driven architecture combined with Next.js App Router conventions to ensure separation of concerns and maintainability.

```text
/var/www/butterscribe/src/
├── app/                      # Next.js App Router (Pages & Routing)
│   ├── api/                  # Backend API routes (e.g., auth, next-auth)
│   ├── approvals/            # Content approvals workflow page
│   ├── auth/                 # Authentication pages (signin, signup, password resets)
│   ├── content-calendar/     # Content planning and scheduling UI
│   ├── content-library/      # Content repository page
│   ├── create-content/       # Rich text editor and content creation interface
│   ├── dashboard/            # Main SaaS dashboard overview
│   └── live-preview/         # Document preview and team feedback interface
│
├── components/               # Shared & Core UI Components
│   ├── layout/               # Global layouts
│   │   ├── cms/              # Layout for CMS/Public pages (Header, Footer, Nav)
│   │   └── dashboard/        # Layout for the authenticated SaaS (Sidebar, Header)
│   ├── shared/               # Reusable generic components (Logo, Form Fields)
│   └── ui/                   # Primitive UI components (Button, Badge, Card, etc.)
│
├── modules/                  # Feature-specific Domain Modules
│   ├── dashboard/            # Dashboard widgets (StatsGrid, ContentTable, HeroPrompt)
│   ├── editor/               # Tiptap Rich Text Editor components and local store
│   └── keywords/             # Keyword analysis components and local store
│
├── store/                    # Global State Management (Zustand)
│   └── layoutStore.ts        # Manages global UI state (Sidebar collapse, Theme)
│
├── models/                   # Database Schemas (Mongoose)
│   └── user.ts               # Shared User schema (auth credentials, roles)
│
├── lib/                      # Utilities and API functions
│   ├── actions/              # Server/Client actions (e.g., Auth form submissions)
│   ├── db.ts                 # MongoDB connection utility
│   └── utils.ts              # Generic utilities (e.g., tailwind `cn` merger)
│
└── schemas/                  # Zod Validation Schemas
    └── zodAuthFormSchemas.ts # Validation rules for auth forms
```

## 4. Key Architectural Decisions

### 4.1 Routing & Middleware
- The application uses the `src/middleware.ts` to intercept routes.
- **Protected Routes**: Paths like `/dashboard`, `/approvals`, `/content-library`, and `/create-content` are strictly protected. Users without valid NextAuth JWT tokens are redirected to `/auth/signin`.
- **Auth Guarding**: Authenticated users navigating to `/auth/*` pages are instantly redirected to `/dashboard` to prevent redundant logins.

### 4.2 State Management
- **Zustand** is chosen over React Context for global UI and feature state due to its minimal boilerplate and performance optimizations (preventing unnecessary re-renders).
- State is decoupled into focused stores (e.g., `layoutStore` for sidebar/theme toggles, and module-specific stores for editor and keyword features).

### 4.3 UI & Layouts
The layout system has been heavily refactored to separate the "Marketing/CMS" context from the "App/Dashboard" context:
- `src/components/layout/cms/`: Contains standard navigation used on public or auth pages.
- `src/components/layout/dashboard/`: Contains the responsive `Sidebar` and `Header` designed specifically for the authenticated workspace.

### 4.4 Authentication Flow
- Handled via `NextAuth.js` with a Custom Credentials provider.
- `bcryptjs` is used to hash passwords before storing them in MongoDB.
- During sign-in or sign-up, `handleAuthFormSubmits.ts` processes the logic and enforces a strict client-side redirect directly to `/dashboard` upon success.

## 5. Development & Deployment

- **Package Manager**: npm
- **Linting & Formatting**: ESLint + Prettier configurations natively integrated with Next.js.
- **Styling**: Tailwind CSS v4 running via PostCSS integration, ensuring rapid UI prototyping and strict design system adherence via customized themes (`globals.css`).

## 6. Content Creation Module Deep Dive

The content creation interface (`/create-content`) is the core workspace of the Butterscribe SaaS, designed to provide a distraction-free, highly interactive writing environment with AI integration, secure workflows, and team collaboration features.

### 6.1 Modular Implementation Architecture
The interface has been refactored into a modular, component-driven architecture to ensure maintainability. Sub-components are stored in a private route group folder to decouple them from the application's URL structure:
- **Location**: `src/app/create-content/(components)/`
- **Key Components**:
  - `DocumentOutline.tsx`: A live-synced sidebar that extracts H1-H6 headings and enables click-to-scroll navigation.
  - `Toolbar.tsx`: A feature-rich, sticky formatting bar containing typography, alignment, and color controls.
  - `ReviewSidebar.tsx`: Manages the dual-mode right sidebar (Collaboration Comments vs. SEO Optimization Suite).
  - `EditorModals.tsx`: Encapsulates custom UI modals for Link and Image management, replacing browser default prompts.

### 6.2 Advanced Editor Features (Tiptap Integration)
The editor is powered by a fully integrated **Tiptap** engine, synchronized via a localized Zustand `editorStore`. Key features include:
- **Rich Formatting**: Support for Bold, Italic, Underline, Strikethrough, Blockquotes, Inline Code, and multi-level headings (H1-H6).
- **Color & Highlights System**: 
  - 3 curated text colors (Blue, Purple, Emerald) and 3 highlight colors (Yellow, Blue, Emerald).
  - Implemented using a "Hover-to-Reveal" popover system for a clean, professional UI.
  - Dedicated "Eraser" controls for resetting styles to system defaults.
- **Media Support**: 
  - **Local Uploads**: Integrated `FileReader` API for embedding local images as Base64 strings.
  - **External Media**: Support for external image URLs via custom input modals.
- **Document Navigation**: Headings are extracted in real-time on every update, ensuring the `DocumentOutline` always reflects the current document structure.

### 6.3 Security & Anti-AI Protections
To maintain content authenticity, the editor implements a strict **Anti-Paste Security Layer**:
- **Paste Interception**: A global `handlePaste` prop in the editor configuration blocks all clipboard actions.
- **User Feedback**: Intercepted paste attempts trigger a high-visibility `sonner` toast notification, informing the user that manual typing is required to ensure originality.

### 6.4 Next Steps & Roadmap
- **AI Ghostwriter Integration**: Finalize the connection between the `editorStore` and the AI backend service.
- **Persistence Layer**: Migrate from local store persistence to a MongoDB-backed saving system with autosave indicators.
- **Collaborative Comments**: Transform the static review mode into a live, multi-user commenting system.

