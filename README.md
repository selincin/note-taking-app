# 📝 Note-Taking App

A modern, responsive note-taking app built with Angular 20 and Angular Material. This is a **frontend-only project** that uses Supabase as a backend-as-a-service for data storage and a REST API, consumed directly via Angular's `HttpClient` (no Supabase JS client).

## 🌐 Live Demo

[Note-Taking App](#)
Deployed with Vercel

## 🎯 Challenge

This project is based on the [Note-taking web app](https://www.frontendmentor.io/challenges/note-taking-web-app-773r7bUfOG) challenge by [Frontend Mentor](https://www.frontendmentor.io).

## ✨ Features

- 📝 Create, edit and delete notes
- 🗃️ Archive & restore notes
- 📋 View all notes and all archived notes separately
- 🔍 Search notes by title, text and tags (live, from 3 characters)
- 🏷️ Filter notes by one or multiple tags via sidebar (desktop) or dedicated tags page (mobile)
- 🕓 "Recent searches" list, persisted in `localStorage`
- 📅 Display relative creation and last edited date
- 🔔 Toast notifications for create, update, delete and archive actions
- 🌍 Internationalization (i18n) support (English / German)
- 📱 Fully responsive layout with a master-detail view on desktop and a stacked navigation on mobile
- ⌨️ Route-based navigation with reactive route params (no stale note data when switching notes)

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Angular 20 (standalone components) | UI Framework |
| TypeScript | Type safety |
| Angular Signals (`signal`, `computed`, `effect`) | Reactive state management |
| Angular Material | UI component library |
| Tailwind CSS | Utility-first styling |
| Angular `HttpClient` | HTTP client, talks directly to Supabase's REST API |
| Supabase (PostgREST) | Backend as a Service / REST API |
| RxJS + `@angular/core/rxjs-interop` (`toSignal`, `toObservable`) | Bridging Observables (route params, reactive forms) with Signals |
| ngx-toastr | Toast notifications |
| ngx-translate | Internationalization |
| Reactive Forms | Note create/edit dialog with validation |

## ⚠️ Frontend Only

This is a **pure frontend project**. There is no custom backend — Supabase provides the REST API, and all requests go directly against Supabase's auto-generated PostgREST endpoints using Angular's `HttpClient`, without the `@supabase/supabase-js` client library.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A [Supabase](https://supabase.com) account with a `notes` table

### Installation

```sh
npm install
```

### Environment Variables

Configure your Supabase project URL, anon key and API endpoint in `src/environments/environment.ts` and `environment.development.ts`:

```ts
export const environment = {
  production: false,
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_KEY: 'your-anon-public-key',
  API_NOTES: '/rest/v1/notes',
};
```

### Development

```sh
ng serve
```

### Build

```sh
ng build
```

## 🗄️ Database Schema

```sql
notes (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  text          text not null,
  tags          text[] default '{}',
  created_at    timestamptz default now(),
  edited_at     timestamptz,
  archived      boolean default false
)
```

## 📁 Project Structure

```
src/app/
├── component/
│   ├── header/                # Top bar with note count & desktop search
│   ├── sidebar-nav/            # Desktop navigation + tag filter chips
│   ├── bottom-nav/              # Mobile bottom navigation
│   ├── note-list/                # Notes list
│   ├── note-list-item/            # Single note preview card
│   ├── empty-note-state/           # Empty state when no note is selected (desktop)
│   └── dialogs/notes-dialog/        # Create/edit note dialog (Reactive Forms)
├── pages/
│   ├── all-notes/                # Active notes master-detail view
│   ├── archived-notes/            # Archived notes view
│   ├── note-detail/                # Single note detail view
│   ├── search/                      # Mobile search page
│   └── tags/                          # Mobile tag browsing page
├── services/
│   ├── notes.service.ts             # Notes CRUD, filtering, search, tags (Signals)
│   └── layout.service.ts             # Responsive breakpoint signals
├── models/
│   └── note.model.ts                  # Note class
├── pipes/
│   └── relative-date-pipe.ts           # "2 days ago" style date formatting
├── environments/
├── app.routes.ts
└── app.config.ts
```
