# UrbanConnect 🏙️

> A modern real-time chat and messaging platform built for urban communities — connect with neighbours, local groups, and city services in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
    - [Routing](#routing)
    - [State Management](#state-management)
    - [Authentication](#authentication)
    - [Layouts](#layouts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

UrbanConnect is a chat and messaging UI built with **React 19**, **TypeScript**, and **Ant Design**. It follows a clean separation between public, user, and admin experiences through role-based routing and protected layouts.

The app is designed for scalability — each feature domain (conversations, users) lives in its own provider with isolated state, actions, and reducers.

---

## Features

- 🔐 **Role-based authentication** — separate portals for users (`/chat`) and admins (`/admin`)
- 💬 **Real-time messaging** — live conversation threads with optimistic UI updates
- 🗂️ **Conversation management** — list, search, and navigate between threads
- 👥 **Admin dashboard** — manage users, view platform stats, moderate conversations
- 🎨 **Ant Design UI** — consistent, accessible component library with custom theming via `antd-style`
- ⚡ **Code splitting** — all routes lazy-loaded for fast initial page loads
- 📱 **Responsive** — collapsible sidebar, mobile-friendly layouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build Tool | Vite 6 |
| UI Library | Ant Design 5 |
| Styling | antd-style (CSS-in-JS) |
| Routing | React Router v7 |
| State | Context API + redux-actions + useReducer |
| HTTP | Axios |
| Linting | ESLint + typescript-eslint |

---

## Project Structure

```
src/
├── components/
│   └── navbar/
│       ├── navbar.tsx          # Top navigation bar
│       └── style/
│           └── style.ts        # antd-style createStyles
│
├── hoc/
│   └── withAuth.tsx            # Role-based route protection HOC
│
├── layouts/
│   ├── admin.tsx               # Admin portal shell (Sider + Header + Outlet)
│   ├── chat.tsx                # Chat portal shell (two-panel layout)
│   └── empty.tsx               # Public pages shell (login, landing)
│
├── pages/
│   ├── login/                  # Login page
│   ├── conversations/          # Conversation list (chat sidebar)
│   ├── chatWindow/             # Active message thread
│   ├── adminDashboard/         # Admin stats overview
│   ├── adminUsers/             # User management CRUD
│   └── adminConversations/     # Conversation moderation
│
├── providers/
│   ├── conversationProvider/
│   │   ├── context.tsx         # IConversation, IMessage interfaces + contexts
│   │   ├── actions.tsx         # createAction creators (PENDING/SUCCESS/ERROR)
│   │   ├── reducer.tsx         # handleActions reducer
│   │   └── index.tsx           # Provider component + useConversationState/Actions hooks
│   └── userProvider/
│       ├── context.tsx
│       ├── actions.tsx
│       ├── reducer.tsx
│       └── index.tsx
│
├── routes/
│   ├── chat.routes.tsx         # Lazy-loaded chat route config array
│   ├── admin.routes.tsx        # Lazy-loaded admin route config array
│   └── index.tsx               # Barrel export
│
├── styles/
│   ├── theme.ts                # Ant Design ConfigProvider token overrides
│   └── shared.ts               # Shared antd-style utilities (bubbles, avatars, etc.)
│
├── utils/
│   └── axiosInstance.tsx       # Axios factory with auth interceptor
│
├── App.tsx                     # Route tree (Routes / Route / Outlet)
├── main.tsx                    # Entry point — BrowserRouter + ConfigProvider
└── index.css                   # Global resets
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 8.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/urbanconnect.git
cd urbanconnect

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API base URL and any other config

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3001**

### Default Credentials (Development)

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin` |
| User | `user` | `user` |

> ⚠️ These are dev-only defaults. Production login connects to your backend API.

---

## Environment Variables

Create a `.env` file in the project root. See `.env.example` for the full list.

```env
# Required — base URL for all API requests
VITE_BACKEND_API_URL=http://localhost:8080/api

# Optional — WebSocket endpoint for real-time messaging
VITE_WS_URL=ws://localhost:8080/ws
```

> All client-side env vars must be prefixed with `VITE_` to be exposed by Vite.

---

## Available Scripts

```bash
npm run dev        # Start dev server on port 3001 (hot reload)
npm run build      # Type-check + production build → dist/
npm run preview    # Serve the production build locally
npm run lint       # Run ESLint across all .ts / .tsx files
```

---

## Architecture

### Routing

UrbanConnect uses **React Router v7** with a nested route tree defined in `App.tsx`. Route configs for each section live in `src/routes/` as plain arrays of `{ path, element, icon, name }` objects — consumed by both the router and the sidebar `<Menu>`.

```
/                       → EmptyLayout
  index / login         → <Login />

/chat                   → ProtectedChatLayout  (roles: user, admin)
  index                 → <ConversationList />
  :conversationId       → <ChatWindow />

/admin                  → ProtectedAdminLayout  (role: admin)
  index                 → <AdminDashboard />
  users                 → <AdminUsers />
  conversations         → <AdminConversations />
```

All page components are **lazy-loaded** with `React.lazy()` and wrapped in `<Suspense>` inside each layout.

### State Management

Each feature domain uses an isolated three-file provider pattern:

```
context.tsx   →  TypeScript interfaces + createContext (state + actions)
actions.tsx   →  createAction creators with PENDING / SUCCESS / ERROR variants
reducer.tsx   →  handleActions spreading action.payload onto state
index.tsx     →  Provider component (useReducer) + custom hooks
```

**Conversation provider example:**

```tsx
// Dispatch a fetch
const { getConversations } = useConversationActions();
useEffect(() => { getConversations(); }, []);

// Read state
const { conversations, isPending, isError } = useConversationState();
```

### Authentication

Route protection is handled by the `withAuth` Higher-Order Component in `src/hoc/withAuth.tsx`.

```tsx
const ProtectedChatLayout = withAuth(ChatLayout, { allowedRoles: ['user', 'admin'] });
const ProtectedAdminLayout = withAuth(AdminLayout, { allowedRoles: ['admin'] });
```

`withAuth` reads `auth_token` and `user_role` from `localStorage`:
- No token → redirect to `/login`
- Wrong role → redirect to the user's own home (`/chat` or `/admin`)

The `UserProvider`'s `login` action stores the token and role on success; `logout` clears them.

### Layouts

| Layout | Path prefix | Description |
|---|---|---|
| `EmptyLayout` | `/` | Centred single-column shell for public pages |
| `ChatLayout` | `/chat` | Two-panel: conversation sidebar + message area |
| `AdminLayout` | `/admin` | Fixed sidebar with `<Menu>` + header + content area |

Each layout renders `<Outlet />` for its child routes and uses `theme.useToken()` from Ant Design for dynamic colour tokens. Component-level styles live in colocated `style/style.ts` files using `createStyles` from `antd-style`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes — run `npm run lint` before committing
4. Commit: `git commit -m 'feat: add your feature'`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request against `main`

Please follow the existing provider and HOC patterns when adding new features. See the [GitHub Issues](./chatx-github-issues.md) file for the full implementation roadmap.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Built with ❤️ for urban communities</p>