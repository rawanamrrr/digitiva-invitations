# Digitiva Wedding Invitation SaaS - Setup Guide

## Prerequisites

- Node.js 18+
- Supabase account
- pnpm or npm

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial_schema.sql` in the SQL Editor
3. Copy your project URL, anon key, and service role key to `.env.local`

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AUTH_SECRET=run: openssl rand -base64 32
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Create Admin User

1. Register at `/register`
2. In Supabase SQL Editor, update the user role:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

## 4. Run Development Server

```bash
npm install
npm run dev
```

## 5. Template Assets (Required for Lamis & Ahmed templates)

Copy assets from the lamis-invitation and ahmed-sameha projects:

```powershell
# Create template directories
New-Item -ItemType Directory -Force -Path "public/templates/lamis"
New-Item -ItemType Directory -Force -Path "public/templates/ahmed"

# Copy lamis assets (adjust paths if needed)
Copy-Item "path/to/lamis-invitation/public/*" "public/templates/lamis/" -Recurse -Force

# Copy ahmed assets
Copy-Item "path/to/ahmed-sameha/public/*" "public/templates/ahmed/" -Recurse -Force
```

Required files:
- **lamis**: engagement-video.mp4, invitation-design.mp4, map-venue.png
- **ahmed**: engagement-video.mp4, invitation-design.png, map-venue.png

## Features

- **Auth**: NextAuth with email/password, JWT sessions
- **Database**: Supabase (PostgreSQL)
- **Payment**: UI-only checkout (replace with Stripe for production)
- **Templates**: Lamis (video hero), Ahmed (image hero) — from lamis-invitation & ahmed-sameha projects
- **Admin**: View all users/invitations, activate/deactivate, delete
- **Subdomain**: Configure `NEXT_PUBLIC_APP_DOMAIN` for bride-groom.yourdomain.com
- **Share**: WhatsApp share button on invitation pages

## Routes

- `/` - Landing
- `/login`, `/register` - Auth
- `/dashboard/create` - Create invitation
- `/dashboard/invitations` - My invitations
- `/invite/[slug]` - Live invitation (public)
- `/admin` - Admin dashboard (admin only)
- `/payment/checkout` - Payment UI (demo)
