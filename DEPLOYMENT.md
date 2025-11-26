# Deployment Instructions

## Vercel Deployment

This Nuxt 3 application is optimized for deployment on Vercel.

### Prerequisites

1.  **Vercel Account**: [Sign up here](https://vercel.com/signup).
2.  **PostgreSQL Database**: You need a hosted PostgreSQL database. Good options include:
    - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
    - [Supabase](https://supabase.com/)
    - [Neon](https://neon.tech/)

### Steps

1.  **Push to GitHub/GitLab/Bitbucket**: Ensure your code is pushed to a repository.
2.  **Import Project in Vercel**:
    - Go to your Vercel Dashboard.
    - Click "Add New..." -> "Project".
    - Select your repository.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Nuxt.js**.
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `.output` (default).
4.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add the following variables:
      - `DATABASE_URL`: Your PostgreSQL connection string.
      - `NUXT_JWT_SECRET`: A long random string for signing tokens.
      - `NUXT_ADMIN_PASSWORD`: The password for the admin dashboard.
5.  **Deploy**: Click "Deploy".

### Database Migration

After deployment, or during the build process, you need to ensure your database schema is applied.
You can run this locally if you can connect to the production DB, or set up a post-install script.
For Vercel, it's often easiest to run migrations locally against the production URL, or add `npx prisma db push` to your build command (not recommended for large production apps, but fine for this).

**Recommended**: Run `npx prisma db push` locally with your production `DATABASE_URL` in your `.env` (temporarily) or passed as an env var.

```bash
DATABASE_URL="your-production-url" npx prisma db push
```
