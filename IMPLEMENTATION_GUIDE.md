# SkillFundr Implementation Guide

This guide provides a step-by-step approach to implementing the SkillFundr platform based on the technical specification.

## 📋 Implementation Phases

### Phase 1: Project Setup (Week 1)

#### 1.1 Initialize Project
```bash
# Already have package.json, so install dependencies
npm install

# Install Prisma
npm install -D prisma
npm install @prisma/client

# Initialize Prisma
npx prisma init
```

#### 1.2 Install Core Dependencies
```bash
# Authentication
npm install next-auth@beta bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken

# Form handling
npm install react-hook-form zod @hookform/resolvers

# Payment
npm install stripe
# OR for Ghana
npm install paystack-node

# Email
npm install resend react-email @react-email/components

# File upload
npm install uploadthing @uploadthing/react

# Utilities
npm install date-fns

# State management
npm install nuqs

# Additional Radix components (if needed beyond what package.json has)
npm install @radix-ui/react-context-menu
```

#### 1.3 Configure Database
1. Copy the Prisma schema from `TECHNICAL_SPECIFICATION.md` section 3.2
2. Paste into `prisma/schema.prisma`
3. Set `DATABASE_URL` in `.env`
4. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### 1.4 Set Up Project Structure
```bash
# Create directory structure
mkdir -p src/{app,components,lib,types,hooks,context,emails}
mkdir -p src/app/{api,\(auth\),\(dashboard\),\(public\)}
mkdir -p src/components/{ui,layout,auth,dashboard,student,organization,task,payment,rating,common}
mkdir -p src/lib/{auth,services,validations,security,constants}
```

---

### Phase 2: Core Infrastructure (Week 2)

#### 2.1 Database Client Setup

**File: `src/lib/prisma.ts`**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 2.2 Utility Functions

**File: `src/lib/utils.ts`**
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-GH', {
    dateStyle: 'medium',
  }).format(new Date(date));
}
```

#### 2.3 Authentication Utilities

**File: `src/lib/auth/password.ts`**
```typescript
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**File: `src/lib/auth/jwt.ts`**
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
```

#### 2.4 Validation Schemas

**File: `src/lib/validations/auth.ts`**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const studentRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  schoolName: z.string().min(2, 'School name is required'),
  major: z.string().optional(),
  yearOfStudy: z.number().min(1).max(7).optional(),
});

export const organizationRegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(['NGO', 'Startup', 'Small Business']),
  contactPerson: z.string().min(2, 'Contact person is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type OrganizationRegisterInput = z.infer<typeof organizationRegisterSchema>;
```

---

### Phase 3: Authentication System (Week 3)

#### 3.1 Auth Service

**File: `src/lib/services/auth-service.ts`**
```typescript
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { UserRole, UserStatus } from '@prisma/client';

export class AuthService {
  async registerStudent(data: any) {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: UserRole.STUDENT,
        status: UserStatus.PENDING_VERIFICATION,
        student: {
          create: {
            schoolName: data.schoolName,
            major: data.major,
            yearOfStudy: data.yearOfStudy,
          },
        },
      },
      include: {
        student: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async registerOrganization(data: any) {
    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.ORGANIZATION,
        status: UserStatus.PENDING_VERIFICATION,
        organization: {
          create: {
            organizationName: data.organizationName,
            organizationType: data.organizationType,
            contactPerson: data.contactPerson,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone,
            description: data.description,
          },
        },
      },
      include: {
        organization: true,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        organization: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING_VERIFICATION) {
      throw new Error('Account is not active');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

export const authService = new AuthService();
```

#### 3.2 Auth API Routes

**File: `src/app/api/auth/register/student/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth-service';
import { studentRegisterSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = studentRegisterSchema.parse(body);
    
    const { user, token } = await authService.registerStudent(validatedData);
    
    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message,
        },
      },
      { status: 400 }
    );
  }
}
```

**File: `src/app/api/auth/login/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth-service';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password } = loginSchema.parse(body);
    
    const { user, token } = await authService.login(email, password);
    
    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message,
        },
      },
      { status: 401 }
    );
  }
}
```

---

### Phase 4: UI Components Setup (Week 4)

#### 4.1 Install Shadcn UI Components

```bash
# Initialize shadcn-ui
npx shadcn-ui@latest init

# Install commonly needed components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
```

#### 4.2 Global Styles

**File: `src/app/globals.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

#### 4.3 Root Layout

**File: `src/app/layout.tsx`**
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillFundr - Connect Students with Opportunity',
  description: 'A digital marketplace connecting students with NGOs and startups',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

### Phase 5: Feature Implementation (Weeks 5-12)

#### Order of Implementation:

1. **Week 5-6: Task System**
   - Task creation (organization)
   - Task listing and search (student)
   - Task details page
   - Task service and API routes

2. **Week 7-8: Application System**
   - Apply for tasks
   - Review applications
   - Accept/reject applications
   - Application service and API routes

3. **Week 9-10: Payment & Escrow**
   - Payment integration (Stripe/Paystack)
   - Escrow system
   - Payment release
   - Payment service and API routes

4. **Week 11: Rating & Reviews**
   - Rating system
   - Review display
   - Rating service and API routes

5. **Week 12: Notifications & Admin**
   - Notification system
   - Email notifications
   - Admin dashboard
   - Analytics

---

### Phase 6: Testing & Deployment (Weeks 13-16)

#### 6.1 Testing
- Unit tests for services
- Integration tests for API routes
- E2E tests for critical flows
- Security audit

#### 6.2 Deployment
- Set up production database
- Configure environment variables
- Deploy to Vercel
- Set up monitoring

---

## 🎯 Quick Implementation Checklist

### Immediate Next Steps (Do These First)

- [ ] Run `npm install` to install dependencies
- [ ] Copy Prisma schema to `prisma/schema.prisma`
- [ ] Set up `.env` file with database URL
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Create `src/lib/prisma.ts`
- [ ] Create basic file structure
- [ ] Initialize Shadcn UI
- [ ] Create authentication service
- [ ] Create first API route (register)
- [ ] Create login page
- [ ] Test authentication flow

### Week-by-Week Priorities

**Week 1:** Setup + Auth  
**Week 2:** Student Profile + Organization Profile  
**Week 3:** Task Creation + Task Listing  
**Week 4:** Task Application System  
**Week 5:** Payment Integration  
**Week 6:** Testing + Bug Fixes  

---

## 📞 Need Help?

Refer to:
- [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md) for detailed architecture
- [README.md](./README.md) for project overview
- [requirement.md](./requirement.md) for original requirements

Good luck with the implementation! 🚀


