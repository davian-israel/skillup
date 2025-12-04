# Quick Database Setup (Bypassing Prisma Cache Issue)

## Run the SQL Script Directly

Since there's a Prisma cache permission issue, let's set up the database directly with SQL:

### Option 1: Using psql Command Line

```bash
cd /Users/davian/Desktop/MVP
psql -d YOUR_DATABASE_NAME -f setup-database.sql
```

Replace `YOUR_DATABASE_NAME` with your actual database name from your `.env` file.

### Option 2: Interactive psql

```bash
# Connect to your database
psql YOUR_DATABASE_NAME

# Run the script
\i /Users/davian/Desktop/MVP/setup-database.sql

# Exit
\q
```

### Option 3: Copy and Paste

1. Open the file `setup-database.sql`
2. Copy all the SQL code
3. Connect to your database:
   ```bash
   psql YOUR_DATABASE_NAME
   ```
4. Paste the SQL code and press Enter
5. Wait for it to complete

---

## ✅ What This Creates

### Test Accounts (All use password: `Test1234`)

**👨‍💼 Admin:**
- Email: admin@skillfundr.com

**👨‍🎓 Students:**
- Email: john.student@example.com (CS Student, Uni of Ghana)
- Email: sarah.student@example.com (Design Student, KNUST)

**🏢 Organizations:**
- Email: tech.ngo@example.com (NGO with 2 tasks)
- Email: startup@example.com (Startup with 2 tasks)

### Sample Data:
- 5 user accounts
- 2 students with skills and portfolios
- 2 organizations
- 4 published tasks ready to browse

---

## After Running the SQL Script

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000
   ```

3. **Login with any test account:**
   - Try: john.student@example.com / Test1234
   - Or: tech.ngo@example.com / Test1234

---

## Verify It Worked

### Check in psql:
```bash
psql YOUR_DATABASE_NAME

# Check users were created
SELECT email, role FROM "User";

# Check tasks were created
SELECT title, status FROM "Task";

# Exit
\q
```

You should see:
- 5 users (1 admin, 2 students, 2 organizations)
- 4 tasks (all with status 'OPEN')

---

## If You Get Errors

### Error: "database does not exist"
```bash
# Create the database first
createdb YOUR_DATABASE_NAME
```

### Error: "role does not exist"
```bash
# Create your PostgreSQL user
createuser YOUR_USERNAME
```

### Error: "permission denied"
```bash
# Grant permissions
psql postgres
GRANT ALL PRIVILEGES ON DATABASE YOUR_DATABASE_NAME TO YOUR_USERNAME;
\q
```

---

## Clean Up Old Data (Optional)

If you want to start fresh, the script includes DROP statements at the top that will remove existing data.

The script will:
1. Drop all existing tables
2. Drop all existing enums
3. Recreate everything fresh
4. Insert test data

---

## Next Steps

After the database is set up:

1. **Test the application:**
   - Login as student
   - Browse the 4 available tasks
   - Apply for a task

2. **Test as organization:**
   - Login as organization
   - View your posted tasks
   - Create a new task

3. **Start developing:**
   - All APIs are working
   - All test accounts ready
   - Begin building additional features

---

## Password for All Accounts

**Test1234**

(This is hashed in the database as: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2`)

---

## Success! 🎉

Once you run the SQL script and start the server, you're ready to go!

All test accounts and sample data will be available immediately.



