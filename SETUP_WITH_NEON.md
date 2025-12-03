# Setup SkillFundr with Neon Database

## Issue: Prisma Cache Permission Problem

There's a permission issue with Prisma's cache. Here's how to fix it and set up your database:

---

## Solution 1: Fix Prisma Cache Permissions (Recommended)

Run these commands in your terminal:

```bash
# Navigate to project
cd /Users/davian/Desktop/MVP

# Fix Prisma cache permissions
sudo chmod -R 755 ~/.cache/prisma

# OR completely remove and recreate
sudo rm -rf ~/.cache/prisma

# Now generate Prisma client
npx prisma generate

# Push schema to your Neon database
npx prisma db push

# Seed the database with test accounts
node setup-db.js
```

---

## Solution 2: Use Prisma Studio GUI (Easy Alternative)

If the above doesn't work, you can set up the database using Prisma Studio:

```bash
# 1. First, fix cache permissions
sudo chmod -R 755 ~/.cache/prisma

# 2. Generate client
npx prisma generate

# 3. Open Prisma Studio
npx prisma studio
```

This will open a GUI where you can manually add the test data, or you can proceed with the seeding script once Prisma client is generated.

---

## Solution 3: Manual Steps (If All Else Fails)

### Step 1: Fix Cache
```bash
sudo rm -rf ~/.cache/prisma
```

### Step 2: Generate Client
```bash
cd /Users/davian/Desktop/MVP
npx prisma generate
```

### Step 3: Push Schema
```bash
npx prisma db push
```

### Step 4: Seed Database
```bash
node setup-db.js
```

---

## After Successful Setup

You should see this output:

```
✨ Database setup complete!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Test Accounts Created:

👨‍💼 Admin Account:
   Email: admin@skillfundr.com
   Password: Test1234

👨‍🎓 Student Accounts:
   Email: john.student@example.com
   Password: Test1234
   Email: sarah.student@example.com
   Password: Test1234

🏢 Organization Accounts:
   Email: tech.ngo@example.com
   Password: Test1234
   Email: startup@example.com
   Password: Test1234

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 You can now run: npm run dev
```

---

## Start Your Application

```bash
npm run dev
```

Open: **http://localhost:3000**

Login with any of the test accounts!

---

## Verify Database

To check if the data was created:

```bash
npx prisma studio
```

You should see:
- 5 Users (1 admin, 2 students, 2 organizations)
- 4 Tasks (all status: OPEN)
- 6 Student Skills
- 2 Portfolio Items

---

## Quick Test

1. **Go to:** http://localhost:3000
2. **Click:** Login
3. **Enter:**
   - Email: john.student@example.com
   - Password: Test1234
4. **You should see:** Student dashboard with "Browse Tasks" option
5. **Click Browse Tasks:** You should see 4 available tasks!

---

## Troubleshooting

### Still getting permission errors?

Try with sudo:
```bash
sudo npx prisma generate
sudo npx prisma db push
node setup-db.js
```

### Can't run node script?

Make sure you're in the right directory:
```bash
cd /Users/davian/Desktop/MVP
pwd  # Should show: /Users/davian/Desktop/MVP
node setup-db.js
```

### Database connection error?

Check your .env file has the correct Neon connection string:
```bash
cat .env | grep DATABASE_URL
```

Should show your Neon connection string starting with:
`postgresql://neondb_owner:...`

---

## Alternative: Manual Database Setup via Neon Console

If none of the above works, you can also:

1. Go to: https://console.neon.tech
2. Open your project
3. Go to SQL Editor
4. Copy and paste the contents of `setup-database.sql`
5. Click "Run"

This will create all tables and insert test data directly.

---

## Success Indicators

✅ **You know it worked when:**
- `npx prisma studio` shows tables with data
- You can login at http://localhost:3000
- Student dashboard shows "Browse Tasks"
- You see 4 tasks when clicking "Browse Tasks"

---

## Need Help?

If you're still stuck, you can:

1. **Check if tables exist:**
   ```bash
   npx prisma studio
   ```

2. **View your database in Neon console:**
   - Go to: https://console.neon.tech
   - Select your project
   - Go to "Tables" tab

3. **Try the SQL file directly in Neon:**
   - Open `setup-database.sql`
   - Copy all content
   - Paste in Neon SQL Editor
   - Run

---

## 🎉 Once Setup is Complete

**Test Accounts (All use password: Test1234):**

| Role | Email | Access |
|------|-------|--------|
| Admin | admin@skillfundr.com | Full admin |
| Student | john.student@example.com | Browse & apply for tasks |
| Student | sarah.student@example.com | Browse & apply for tasks |
| NGO | tech.ngo@example.com | Create & manage tasks |
| Startup | startup@example.com | Create & manage tasks |

**You're ready to go!** 🚀


