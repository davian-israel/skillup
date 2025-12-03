# Quick Start Guide

Get SkillFundr running locally in 10 minutes!

## Prerequisites

Make sure you have installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- Git

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, React, and UI libraries.

### 2. Set Up Database

**Create PostgreSQL Database:**

```bash
# Login to PostgreSQL
psql postgres

# Create database
CREATE DATABASE skillfundr;

# Create user (optional)
CREATE USER skillfundr_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE skillfundr TO skillfundr_user;

# Exit
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the template
cp ENV_TEMPLATE.txt .env

# Edit .env with your actual values
nano .env  # or use your preferred editor
```

**Minimum Required Variables:**

```env
DATABASE_URL="postgresql://skillfundr_user:your_password@localhost:5432/skillfundr"
JWT_SECRET="your-super-secret-jwt-key-change-this-now"
NEXTAUTH_SECRET="another-secret-key-for-nextauth"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Set Up Prisma Database

**Create the Prisma schema file:**

Create `prisma/schema.prisma` and copy the schema from `TECHNICAL_SPECIFICATION.md` section 3.2.

**Initialize Database:**

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Project Structure Overview

```
MVP/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── (auth)/       # Auth pages (login, register)
│   │   ├── (dashboard)/  # Dashboard pages
│   │   ├── (public)/     # Public pages (landing, about)
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...           # Feature components
│   ├── lib/              # Business logic
│   │   ├── services/     # Service layer
│   │   ├── validations/  # Zod schemas
│   │   └── auth/         # Auth utilities
│   └── types/            # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── [config files]
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio (DB GUI)
npm run db:push          # Push schema changes (dev only)

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

## Next Steps

### Phase 1: Set Up UI Components

```bash
# Initialize Shadcn UI
npx shadcn-ui@latest init

# Add essential components
npx shadcn-ui@latest add button card input form dialog
```

### Phase 2: Create Basic File Structure

```bash
# Create directories
mkdir -p src/app/{api,\(auth\),\(dashboard\),\(public\)}
mkdir -p src/components/{ui,layout,auth,dashboard}
mkdir -p src/lib/{services,validations,auth}
```

### Phase 3: Build Authentication

1. Create auth service (`src/lib/services/auth-service.ts`)
2. Create auth API routes (`src/app/api/auth/`)
3. Create login page (`src/app/(auth)/login/page.tsx`)
4. Create registration pages

### Phase 4: Implement Core Features

Follow the detailed implementation plan in `IMPLEMENTATION_GUIDE.md`

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql "postgresql://user:password@localhost:5432/skillfundr"

# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Resources

- **Technical Specification:** `TECHNICAL_SPECIFICATION.md`
- **Implementation Guide:** `IMPLEMENTATION_GUIDE.md`
- **Requirements:** `requirement.md`
- **Main README:** `README.md`

## Getting Help

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Common Issues
1. **Build errors:** Run `npm run type-check` to find TypeScript issues
2. **Database errors:** Check `DATABASE_URL` in `.env`
3. **UI not styling:** Make sure Tailwind is configured correctly

---

## Success Checklist

- [ ] Node.js and PostgreSQL installed
- [ ] Dependencies installed (`npm install`)
- [ ] Database created
- [ ] `.env` file configured
- [ ] Prisma schema created
- [ ] Database migrated (`npm run db:migrate`)
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:3000

**Ready to build!** 🚀

Start with the authentication system following the `IMPLEMENTATION_GUIDE.md`


