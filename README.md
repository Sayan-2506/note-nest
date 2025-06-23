# NoteNest

A minimal note-taking application built with **Nuxt 3** and **Prisma**. Users can register, log in and manage simple text notes. Notes are grouped by the day they were last updated (Today, Yesterday or the previous 30 days).

## Features

- **User registration and login** using email and password.
- **JWT based authentication**. The token is stored in the `NoteNestJWT` cookie.
- **Create and edit notes** which are persisted in a MySQL database via Prisma.
- Responsive UI styled with **Tailwind CSS**.

## Project Structure

- `pages/` – login, registration and the main notes page.
- `server/api/` – API endpoints for user and note management.
- `middleware/auth.js` – redirects unauthenticated users to the registration page.
- `prisma/` – database schema and migrations.

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
2. Create an `.env` file with at least the following variables:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="your-secret"
   ```
3. Run Prisma migrations locally:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The app will be available at `http://localhost:3000`.

## Production

Build the app and preview the production build:
```bash
npm run build
npm run preview
```

If deploying to an environment without development tools, run the migrations with:
```bash
npx prisma migrate deploy
```

---

This project was bootstrapped with Nuxt 3. Refer to the [Nuxt documentation](https://nuxt.com/docs) for additional configuration options.
