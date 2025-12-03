# Setup Instructions for SkillFundr MVP

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running

## Step-by-Step Setup

### 1. Create Environment File

Create a file named `.env` in the project root with the following content:

```env
# Database
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/skillfundr"

# Authentication
JWT_SECRET="8f3a9d5c7e1b4f6a8c0d2e5f7a9b1c3d4e6f8a0b2c4d6e8f0a1b3c5d7e9f1a3b"
ENCRYPTION_KEY="generate-a-64-char-hex-string-for-aes-256-encryption-security"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="7b2a4e8f1c5d9a6b3e7f0c4a8d2f6b9e1c5a7d3f9b0e4a6c8d1f5b7a9c3e5f1"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Replace `YOUR_USERNAME` with your macOS username (usually your first name in lowercase)**

### 2. Create PostgreSQL Database

```bash
# Option 1: Using createdb command
createdb skillfundr

# Option 2: Using psql
psql postgres
CREATE DATABASE skillfundr;
\q
```

### 3. Install tsx (for running seed script)

```bash
npm install --save-dev tsx --legacy-peer-deps
```

### 4. Generate Prisma Client and Run Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed the Database with Test Data

```bash
npm run db:seed
```

This will create test accounts:
- 1 Admin account
- 2 Student accounts  
- 2 Organization accounts
- 4 Sample tasks

### 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Test Accounts

### Admin Account
- **Email:** admin@skillfundr.com
- **Password:** Test1234
- **Access:** Full system administration

### Student Accounts
1. **John Mensah (Computer Science)**
   - **Email:** john.student@example.com
   - **Password:** Test1234
   - **Skills:** Web Development, UI/UX Design, React
   - **School:** University of Ghana

2. **Sarah Osei (Graphic Design)**
   - **Email:** sarah.student@example.com
   - **Password:** Test1234
   - **Skills:** Graphic Design, Content Writing, Social Media
   - **School:** KNUST

### Organization Accounts
1. **Tech for Good Ghana (NGO)**
   - **Email:** tech.ngo@example.com
   - **Password:** Test1234
   - **Posted Tasks:** Website Development, Social Media Content

2. **GhanaFintech Solutions (Startup)**
   - **Email:** startup@example.com
   - **Password:** Test1234
   - **Posted Tasks:** Mobile App UI/UX, Content Writing

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL if not running
brew services start postgresql
```

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Found
```bash
npx prisma generate
```

### Module Not Found Errors
```bash
npm install --legacy-peer-deps
```

## Quick Commands

```bash
# View database in GUI
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database
npm run db:seed
```

## Next Steps

1. Test login with different account types
2. Browse tasks as a student
3. Create tasks as an organization
4. Apply for tasks
5. Implement remaining features (see TODO list below)

## TODO: Features to Implement

### High Priority
- [ ] Task detail page with apply form
- [ ] Create task form for organizations
- [ ] Student applications list
- [ ] Organization task management
- [ ] Profile editing pages

### Medium Priority
- [ ] Task submission system
- [ ] Application review system
- [ ] File upload functionality
- [ ] Search and filters

### Low Priority  
- [ ] Payment integration
- [ ] Email notifications
- [ ] Rating system
- [ ] Admin dashboard

Happy coding! 🚀

