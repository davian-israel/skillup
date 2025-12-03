# How to Run the SkillFundr Project Locally

## Quick Setup (Recommended)

### Option 1: Automated Setup Script

```bash
# Make setup script executable (if not already)
chmod +x setup.sh

# Run the setup script
./setup.sh

# Start the development server
npm run dev
```

The setup script will:
- Create `.env` file with your username
- Install all dependencies
- Create PostgreSQL database
- Run migrations
- Seed test data

Then open http://localhost:3000

---

## Manual Setup (Step by Step)

### Step 1: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 2: Create .env File

Create a file named `.env` in the project root:

```bash
# On macOS/Linux
cat > .env << 'EOF'
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/skillfundr"
JWT_SECRET="8f3a9d5c7e1b4f6a8c0d2e5f7a9b1c3d4e6f8a0b2c4d6e8f0a1b3c5d7e9f1a3b"
ENCRYPTION_KEY="generate-a-64-char-hex-string-for-aes-256-encryption-security"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="7b2a4e8f1c5d9a6b3e7f0c4a8d2f6b9e1c5a7d3f9b0e4a6c8d1f5b7a9c3e5f1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

**Replace `YOUR_USERNAME` with your actual username:**
- Run `whoami` in terminal to find your username
- Update the DATABASE_URL line

### Step 3: Create Database

```bash
# Create the database
createdb skillfundr

# Verify it was created
psql -l | grep skillfundr
```

### Step 4: Set Up Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init
```

### Step 5: Seed Database with Test Data

```bash
npm run db:seed
```

This creates:
- 1 Admin account
- 2 Student accounts
- 2 Organization accounts
- 4 Sample tasks

### Step 6: Start Development Server

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Test the Application

### 1. Login as Student

1. Go to http://localhost:3000
2. Click "Login"
3. Use credentials:
   - **Email:** john.student@example.com
   - **Password:** Test1234
4. Explore:
   - Browse available tasks
   - View task details
   - Apply for tasks

### 2. Login as Organization

1. Logout (click Logout button)
2. Login with:
   - **Email:** tech.ngo@example.com
   - **Password:** Test1234
3. Explore:
   - View posted tasks
   - Create new tasks
   - Review applications

### 3. Login as Admin

1. Logout
2. Login with:
   - **Email:** admin@skillfundr.com
   - **Password:** Test1234
3. Admin dashboard (to be implemented)

---

## Test Accounts Summary

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Admin** | admin@skillfundr.com | Test1234 | Full system access |
| **Student** | john.student@example.com | Test1234 | CS student, Uni of Ghana |
| **Student** | sarah.student@example.com | Test1234 | Design student, KNUST |
| **NGO** | tech.ngo@example.com | Test1234 | Tech for Good Ghana |
| **Startup** | startup@example.com | Test1234 | GhanaFintech Solutions |

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes (dev only)
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed test data

# Type checking
npm run type-check       # Check TypeScript errors
npm run lint             # Run ESLint
```

---

## Troubleshooting

### Error: Database "skillfundr" does not exist

```bash
createdb skillfundr
```

### Error: Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Error: Cannot find module '@prisma/client'

```bash
npx prisma generate
```

### Error: Role "username" does not exist

Update your DATABASE_URL in `.env` with the correct PostgreSQL username:

```bash
# Find your PostgreSQL username
whoami

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://YOUR_ACTUAL_USERNAME@localhost:5432/skillfundr"
```

### PostgreSQL not running

```bash
# macOS with Homebrew
brew services start postgresql

# Check if running
brew services list
```

### Module not found errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Prisma migration errors

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev --name init
npm run db:seed
```

---

## Development Workflow

1. **Make code changes**
2. **Server auto-reloads** (Hot Module Replacement)
3. **View in browser** at http://localhost:3000
4. **Check console** for errors (both browser and terminal)
5. **Use Prisma Studio** to inspect database:
   ```bash
   npx prisma studio
   ```

---

## Next Steps After Running

1. ✅ Test login with different account types
2. ✅ Browse tasks as a student
3. ✅ View organization dashboard
4. ✅ Explore the codebase

### Features to Implement:
- Task detail page with apply form
- Create task form
- Applications management
- Profile editing
- File uploads
- Payment integration

---

## Project Structure

```
MVP/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, register)
│   │   ├── (dashboard)/    # Dashboard pages
│   │   ├── api/            # API routes
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   ├── lib/                # Business logic, services
│   └── types/              # TypeScript types
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── public/                 # Static assets
```

---

## Success! 🎉

If you see the landing page at http://localhost:3000, you're all set!

Try logging in with the test accounts and exploring the different user dashboards.

**Happy coding!** 🚀

---

## Getting Help

- **Setup Issues:** Check `SETUP_INSTRUCTIONS.md`
- **Technical Details:** See `TECHNICAL_SPECIFICATION.md`
- **Implementation:** See `IMPLEMENTATION_GUIDE.md`
- **Quick Reference:** See `START_HERE.md`

For database issues, use Prisma Studio to inspect data:
```bash
npx prisma studio
```

