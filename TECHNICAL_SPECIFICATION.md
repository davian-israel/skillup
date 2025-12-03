# SkillFundr Technical Specification
## Next.js Full-Stack Application

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema](#3-database-schema)
4. [API Specification](#4-api-specification)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Business Logic Layer](#6-business-logic-layer)
7. [Security Implementation](#7-security-implementation)
8. [Payment & Escrow System](#8-payment--escrow-system)
9. [Notification System](#9-notification-system)
10. [File Structure](#10-file-structure)

---

## 1. System Architecture

### 1.1 Architecture Pattern
**Next.js 14 App Router with Server-Side Rendering (SSR)**

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (React Components + Client-Side State Management)      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│        (Next.js Pages/Layouts + Server Components)      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   API Routes Layer                       │
│              (Next.js API Routes + Middleware)          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 Business Logic Layer                     │
│         (Services + Use Cases + Domain Logic)           │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                      │
│          (Repositories + Database Adapters)             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│    (Database | Payment Gateway | Email | Storage)       │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Core Principles
- **Server-First Approach**: Maximize server components for performance
- **API Routes**: RESTful API using Next.js Route Handlers
- **Type Safety**: Full TypeScript coverage
- **Progressive Enhancement**: Works without JavaScript where possible
- **Mobile-First Responsive Design**

---

## 2. Technology Stack

### 2.1 Core Framework
- **Next.js 14** (App Router)
- **React 18** (Server & Client Components)
- **TypeScript 5.3+**

### 2.2 Database & ORM
- **PostgreSQL** (Primary database)
- **Prisma** (ORM & type-safe database client)
- **Redis** (Caching & session management)

### 2.3 Authentication
- **NextAuth.js v5** (Beta/Auth.js)
- **JWT** for token management
- **OAuth providers** (Google, GitHub optional)

### 2.4 Payment Processing
- **Stripe** or **Paystack** (Ghana-focused)
- Escrow management via custom implementation

### 2.5 UI/Styling
- **Tailwind CSS**
- **Shadcn UI** (Component library)
- **Radix UI** (Headless components)
- **Lucide Icons**

### 2.6 Form Management
- **React Hook Form**
- **Zod** (Schema validation)

### 2.7 File Upload
- **Uploadthing** or **AWS S3**
- **Sharp** (Image optimization)

### 2.8 Email Services
- **Resend** or **SendGrid**
- **React Email** (Email templates)

### 2.9 State Management
- **nuqs** (URL state)
- **React Context** (Global state)
- **Server Actions** (Mutations)

### 2.10 Monitoring & Analytics
- **Vercel Analytics**
- **Sentry** (Error tracking)
- **Posthog** (Product analytics)

### 2.11 Testing
- **Vitest** (Unit tests)
- **Playwright** (E2E tests)
- **Testing Library** (Component tests)

---

## 3. Database Schema

### 3.1 Entity Relationship Diagram

```
User (Abstract)
  ├── Student
  ├── Organization (NGO/Startup)
  └── Admin

Task
  ├── TaskApplication
  └── TaskSubmission

Payment
  └── EscrowTransaction

Rating
Notification
UniversityPartner (Optional)
```

### 3.2 Prisma Schema

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==================== ENUMS ====================

enum UserRole {
  STUDENT
  ORGANIZATION
  ADMIN
  UNIVERSITY
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  PENDING_VERIFICATION
  DEACTIVATED
}

enum TaskStatus {
  DRAFT
  OPEN
  IN_PROGRESS
  SUBMITTED
  UNDER_REVIEW
  COMPLETED
  CANCELLED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum PaymentStatus {
  PENDING
  HELD_IN_ESCROW
  RELEASED
  REFUNDED
  FAILED
}

enum NotificationType {
  TASK_POSTED
  APPLICATION_RECEIVED
  APPLICATION_ACCEPTED
  APPLICATION_REJECTED
  TASK_SUBMITTED
  TASK_APPROVED
  PAYMENT_RECEIVED
  RATING_RECEIVED
  SYSTEM_ALERT
}

// ==================== MODELS ====================

model User {
  id                String       @id @default(cuid())
  email             String       @unique
  emailVerified     DateTime?
  passwordHash      String
  role              UserRole
  status            UserStatus   @default(PENDING_VERIFICATION)
  
  // Profile
  firstName         String
  lastName          String
  phone             String?
  avatarUrl         String?
  bio               String?      @db.Text
  
  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  lastLoginAt       DateTime?
  
  // Relations
  student           Student?
  organization      Organization?
  admin             Admin?
  notifications     Notification[]
  sentRatings       Rating[]     @relation("RatingFrom")
  receivedRatings   Rating[]     @relation("RatingTo")
  
  @@index([email])
  @@index([role])
}

model Student {
  id                String       @id @default(cuid())
  userId            String       @unique
  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Academic Info
  schoolName        String
  studentId         String?
  major             String?
  yearOfStudy       Int?
  expectedGraduation DateTime?
  
  // Financial Info
  tuitionFeeOutstanding Decimal? @db.Decimal(10, 2)
  bankAccountName   String?
  bankAccountNumber String?
  bankName          String?
  
  // Skills & Portfolio
  skills            StudentSkill[]
  portfolioItems    PortfolioItem[]
  
  // Task Relations
  applications      TaskApplication[]
  submissions       TaskSubmission[]
  
  // Verification
  isVerified        Boolean      @default(false)
  verificationDocUrl String?
  universityPartnerId String?
  universityPartner UniversityPartner? @relation(fields: [universityPartnerId], references: [id])
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  @@index([userId])
  @@index([universityPartnerId])
}

model StudentSkill {
  id          String   @id @default(cuid())
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  skillName   String
  level       String   // Beginner, Intermediate, Advanced, Expert
  yearsOfExperience Float?
  
  createdAt   DateTime @default(now())
  
  @@index([studentId])
}

model PortfolioItem {
  id          String   @id @default(cuid())
  studentId   String
  student     Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  title       String
  description String   @db.Text
  url         String?
  imageUrl    String?
  fileUrl     String?
  category    String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([studentId])
}

model Organization {
  id                String       @id @default(cuid())
  userId            String       @unique
  user              User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Organization Info
  organizationName  String
  organizationType  String       // NGO, Startup, Small Business
  registrationNumber String?
  website           String?
  description       String       @db.Text
  logo              String?
  
  // Contact
  contactPerson     String
  contactEmail      String
  contactPhone      String
  address           String?
  
  // Verification
  isVerified        Boolean      @default(false)
  verificationDocUrl String?
  
  // Relations
  tasks             Task[]
  payments          Payment[]
  
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  
  @@index([userId])
}

model Admin {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  permissions String[] // Array of permission strings
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Task {
  id                String       @id @default(cuid())
  organizationId    String
  organization      Organization @relation(fields: [organizationId], references: [id])
  
  // Task Details
  title             String
  description       String       @db.Text
  category          String
  skillsRequired    String[]
  
  // Compensation
  compensationAmount Decimal     @db.Decimal(10, 2)
  compensationType  String       // Tuition, Stipend, Scholarship
  
  // Timeline
  deadline          DateTime
  estimatedDuration String?      // e.g., "2 weeks"
  
  // Status
  status            TaskStatus   @default(DRAFT)
  maxApplicants     Int?
  
  // Requirements
  requirements      String       @db.Text
  deliverables      String       @db.Text
  attachmentUrls    String[]
  
  // Relations
  applications      TaskApplication[]
  submissions       TaskSubmission[]
  payment           Payment?
  
  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  publishedAt       DateTime?
  completedAt       DateTime?
  
  @@index([organizationId])
  @@index([status])
  @@index([category])
}

model TaskApplication {
  id          String            @id @default(cuid())
  taskId      String
  task        Task              @relation(fields: [taskId], references: [id], onDelete: Cascade)
  studentId   String
  student     Student           @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  // Application Details
  coverLetter String            @db.Text
  proposedTimeline String?
  status      ApplicationStatus @default(PENDING)
  
  // Timestamps
  appliedAt   DateTime          @default(now())
  reviewedAt  DateTime?
  
  @@unique([taskId, studentId])
  @@index([taskId])
  @@index([studentId])
  @@index([status])
}

model TaskSubmission {
  id              String   @id @default(cuid())
  taskId          String   @unique
  task            Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  studentId       String
  student         Student  @relation(fields: [studentId], references: [id])
  
  // Submission Details
  description     String   @db.Text
  submissionUrls  String[]
  
  // Review
  isApproved      Boolean?
  reviewNotes     String?  @db.Text
  reviewedAt      DateTime?
  
  // Timestamps
  submittedAt     DateTime @default(now())
  
  @@index([taskId])
  @@index([studentId])
}

model Payment {
  id                String        @id @default(cuid())
  taskId            String        @unique
  task              Task          @relation(fields: [taskId], references: [id])
  organizationId    String
  organization      Organization  @relation(fields: [organizationId], references: [id])
  
  // Payment Details
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("GHS")
  status            PaymentStatus @default(PENDING)
  
  // Escrow
  escrowHeldAt      DateTime?
  escrowReleasedAt  DateTime?
  
  // Payment Gateway
  paymentGateway    String?       // Stripe, Paystack
  gatewayTransactionId String?
  
  // Disbursement
  recipientAccount  String?       // School account or student account
  recipientName     String?
  disbursedAt       DateTime?
  
  // Timestamps
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  
  @@index([taskId])
  @@index([organizationId])
  @@index([status])
}

model Rating {
  id          String   @id @default(cuid())
  fromUserId  String
  fromUser    User     @relation("RatingFrom", fields: [fromUserId], references: [id])
  toUserId    String
  toUser      User     @relation("RatingTo", fields: [toUserId], references: [id])
  
  // Rating Details
  rating      Int      // 1-5 stars
  review      String?  @db.Text
  category    String[] // Professionalism, Quality, Communication, etc.
  
  // Context
  taskId      String?  // Optional reference to task
  
  // Timestamps
  createdAt   DateTime @default(now())
  
  @@unique([fromUserId, toUserId, taskId])
  @@index([toUserId])
  @@index([fromUserId])
}

model Notification {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notification Details
  type        NotificationType
  title       String
  message     String           @db.Text
  link        String?
  
  // Status
  isRead      Boolean          @default(false)
  readAt      DateTime?
  
  // Timestamps
  createdAt   DateTime         @default(now())
  
  @@index([userId])
  @@index([isRead])
}

model UniversityPartner {
  id              String    @id @default(cuid())
  
  // University Info
  name            String
  email           String    @unique
  contactPerson   String
  contactPhone    String?
  address         String?
  
  // Integration
  apiKey          String?   @unique
  webhookUrl      String?
  
  // Relations
  students        Student[]
  
  // Status
  isActive        Boolean   @default(true)
  
  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([email])
}
```

---

## 4. API Specification

### 4.1 API Route Structure

```
/api
  /auth
    /register          POST   - User registration
    /login             POST   - User login
    /logout            POST   - User logout
    /verify-email      POST   - Email verification
    /forgot-password   POST   - Request password reset
    /reset-password    POST   - Reset password
  
  /users
    /profile           GET    - Get current user profile
    /profile           PATCH  - Update user profile
    /[id]              GET    - Get user by ID
  
  /students
    /profile           GET    - Get student profile
    /profile           PUT    - Update student profile
    /skills            POST   - Add skill
    /skills/[id]       DELETE - Remove skill
    /portfolio         POST   - Add portfolio item
    /portfolio/[id]    PUT    - Update portfolio item
    /portfolio/[id]    DELETE - Remove portfolio item
  
  /organizations
    /profile           GET    - Get organization profile
    /profile           PUT    - Update organization profile
    /verify            POST   - Submit verification documents
  
  /tasks
    /                  GET    - List all tasks (with filters)
    /                  POST   - Create new task
    /[id]              GET    - Get task details
    /[id]              PUT    - Update task
    /[id]              DELETE - Delete task
    /[id]/publish      POST   - Publish task
    /[id]/applications GET    - List applications for task
    /[id]/apply        POST   - Apply for task
    /[id]/submit       POST   - Submit task work
    /[id]/approve      POST   - Approve task submission
    /[id]/reject       POST   - Reject task submission
  
  /applications
    /                  GET    - List user's applications
    /[id]              GET    - Get application details
    /[id]/withdraw     POST   - Withdraw application
    /[id]/accept       POST   - Accept application
    /[id]/reject       POST   - Reject application
  
  /payments
    /create            POST   - Create payment/escrow
    /[id]              GET    - Get payment details
    /[id]/release      POST   - Release escrow funds
    /[id]/refund       POST   - Refund payment
    /webhook           POST   - Payment gateway webhook
  
  /ratings
    /                  POST   - Create rating
    /user/[id]         GET    - Get user ratings
  
  /notifications
    /                  GET    - List user notifications
    /[id]/read         POST   - Mark notification as read
    /mark-all-read     POST   - Mark all as read
  
  /admin
    /users             GET    - List all users
    /users/[id]/verify POST   - Verify user
    /users/[id]/suspend POST  - Suspend user
    /tasks             GET    - List all tasks
    /payments          GET    - List all payments
    /analytics         GET    - System analytics
  
  /upload
    /image             POST   - Upload image
    /document          POST   - Upload document
```

### 4.2 API Response Format

**Success Response:**
```typescript
{
  success: true,
  data: T,
  message?: string
}
```

**Error Response:**
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 4.3 Authentication
- All protected routes require `Authorization: Bearer <token>` header
- JWT tokens expire in 7 days (refresh mechanism implemented)
- Session stored in HTTP-only cookies

---

## 5. Frontend Architecture

### 5.1 Route Structure

```
/app
  /(auth)
    /login                    - Login page
    /register                 - Registration page
    /register/student         - Student registration
    /register/organization    - Organization registration
    /forgot-password          - Password reset request
    /reset-password           - Password reset form
    /verify-email             - Email verification
  
  /(dashboard)
    /dashboard
      /student
        /profile              - Student profile
        /tasks                - Browse tasks
        /tasks/[id]           - Task details
        /applications         - My applications
        /submissions          - My submissions
        /earnings             - Earnings history
        /ratings              - My ratings
      
      /organization
        /profile              - Organization profile
        /tasks                - My posted tasks
        /tasks/new            - Create new task
        /tasks/[id]           - Task management
        /tasks/[id]/edit      - Edit task
        /applications         - Review applications
        /payments             - Payment management
        /ratings              - My ratings
      
      /admin
        /overview             - Admin dashboard
        /users                - User management
        /tasks                - Task management
        /payments             - Payment management
        /analytics            - Analytics
  
  /(public)
    /                         - Landing page
    /about                    - About page
    /how-it-works             - How it works
    /for-students             - Student info page
    /for-organizations        - Organization info page
    /contact                  - Contact page
    /faq                      - FAQ page
    /terms                    - Terms of service
    /privacy                  - Privacy policy
```

### 5.2 Component Structure

```typescript
/components
  /ui                         // Shadcn UI components
    /button.tsx
    /card.tsx
    /dialog.tsx
    /form.tsx
    /input.tsx
    /select.tsx
    /toast.tsx
    // ... other UI primitives
  
  /layout
    /header.tsx
    /footer.tsx
    /sidebar.tsx
    /navigation.tsx
    /mobile-menu.tsx
  
  /auth
    /login-form.tsx
    /register-form.tsx
    /student-registration-form.tsx
    /organization-registration-form.tsx
    /forgot-password-form.tsx
  
  /dashboard
    /dashboard-header.tsx
    /dashboard-sidebar.tsx
    /stats-card.tsx
    /notifications-dropdown.tsx
  
  /student
    /student-profile-card.tsx
    /student-profile-form.tsx
    /skill-list.tsx
    /skill-form.tsx
    /portfolio-grid.tsx
    /portfolio-item.tsx
    /portfolio-form.tsx
    /application-card.tsx
    /application-list.tsx
  
  /organization
    /organization-profile-card.tsx
    /organization-profile-form.tsx
    /task-form.tsx
    /application-review-card.tsx
  
  /task
    /task-card.tsx
    /task-list.tsx
    /task-details.tsx
    /task-filters.tsx
    /task-search.tsx
    /task-application-form.tsx
    /task-submission-form.tsx
  
  /payment
    /payment-form.tsx
    /payment-status.tsx
    /escrow-status.tsx
  
  /rating
    /rating-form.tsx
    /rating-display.tsx
    /rating-list.tsx
  
  /common
    /avatar.tsx
    /badge.tsx
    /empty-state.tsx
    /error-boundary.tsx
    /loading-spinner.tsx
    /pagination.tsx
    /search-input.tsx
    /file-upload.tsx
    /image-upload.tsx
```

### 5.3 Page Component Pattern

```typescript
// app/dashboard/student/tasks/page.tsx

import { Suspense } from 'react';
import { TaskList } from '@/components/task/task-list';
import { TaskFilters } from '@/components/task/task-filters';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { getAvailableTasks } from '@/lib/services/task-service';

interface PageProps {
  searchParams: {
    category?: string;
    skills?: string;
    page?: string;
  };
}

export default async function StudentTasksPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Tasks</h1>
        <p className="text-muted-foreground">
          Find tasks that match your skills
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <TaskFilters />
        </aside>
        
        <main className="lg:col-span-3">
          <Suspense fallback={<LoadingSpinner />}>
            <TaskListWrapper searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function TaskListWrapper({ searchParams }: PageProps) {
  const tasks = await getAvailableTasks(searchParams);
  return <TaskList tasks={tasks} />;
}
```

---

## 6. Business Logic Layer

### 6.1 Service Architecture

```typescript
/lib
  /services
    /auth-service.ts          // Authentication logic
    /user-service.ts          // User management
    /student-service.ts       // Student operations
    /organization-service.ts  // Organization operations
    /task-service.ts          // Task management
    /application-service.ts   // Application logic
    /payment-service.ts       // Payment & escrow
    /rating-service.ts        // Rating system
    /notification-service.ts  // Notifications
    /email-service.ts         // Email sending
    /upload-service.ts        // File uploads
```

### 6.2 Service Example

```typescript
// lib/services/task-service.ts

import { prisma } from '@/lib/prisma';
import { TaskStatus, ApplicationStatus } from '@prisma/client';
import { notificationService } from './notification-service';
import { paymentService } from './payment-service';

interface CreateTaskInput {
  organizationId: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  compensationAmount: number;
  compensationType: string;
  deadline: Date;
  requirements: string;
  deliverables: string;
}

interface TaskFilters {
  category?: string;
  skills?: string;
  minCompensation?: number;
  maxCompensation?: number;
  page?: number;
  limit?: number;
}

export class TaskService {
  /**
   * Create a new task
   */
  async createTask(data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.DRAFT,
      },
      include: {
        organization: {
          include: {
            user: true,
          },
        },
      },
    });

    return task;
  }

  /**
   * Publish a task and notify relevant students
   */
  async publishTask(taskId: string, organizationId: string) {
    // Verify ownership
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId,
      },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    // Update task status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
      },
    });

    // Find matching students and notify
    await this.notifyMatchingStudents(updatedTask);

    return updatedTask;
  }

  /**
   * Get available tasks with filters
   */
  async getAvailableTasks(filters: TaskFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      status: TaskStatus.OPEN,
    };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.skills) {
      const skills = filters.skills.split(',');
      where.skillsRequired = {
        hasSome: skills,
      };
    }

    if (filters.minCompensation || filters.maxCompensation) {
      where.compensationAmount = {};
      if (filters.minCompensation) {
        where.compensationAmount.gte = filters.minCompensation;
      }
      if (filters.maxCompensation) {
        where.compensationAmount.lte = filters.maxCompensation;
      }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          organization: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Apply for a task
   */
  async applyForTask(
    taskId: string,
    studentId: string,
    coverLetter: string,
    proposedTimeline?: string
  ) {
    // Check if task is still open
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        organization: true,
      },
    });

    if (!task || task.status !== TaskStatus.OPEN) {
      throw new Error('Task is not available');
    }

    // Check if already applied
    const existingApplication = await prisma.taskApplication.findUnique({
      where: {
        taskId_studentId: {
          taskId,
          studentId,
        },
      },
    });

    if (existingApplication) {
      throw new Error('Already applied to this task');
    }

    // Create application
    const application = await prisma.taskApplication.create({
      data: {
        taskId,
        studentId,
        coverLetter,
        proposedTimeline,
        status: ApplicationStatus.PENDING,
      },
    });

    // Notify organization
    await notificationService.createNotification({
      userId: task.organization.userId,
      type: 'APPLICATION_RECEIVED',
      title: 'New Application Received',
      message: `A student has applied for your task: ${task.title}`,
      link: `/dashboard/organization/tasks/${taskId}/applications`,
    });

    return application;
  }

  /**
   * Accept an application
   */
  async acceptApplication(applicationId: string, organizationId: string) {
    const application = await prisma.taskApplication.findUnique({
      where: { id: applicationId },
      include: {
        task: true,
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.task.organizationId !== organizationId) {
      throw new Error('Unauthorized');
    }

    // Update application status
    const updatedApplication = await prisma.taskApplication.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.ACCEPTED,
        reviewedAt: new Date(),
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: application.taskId },
      data: {
        status: TaskStatus.IN_PROGRESS,
      },
    });

    // Notify student
    await notificationService.createNotification({
      userId: application.student.userId,
      type: 'APPLICATION_ACCEPTED',
      title: 'Application Accepted!',
      message: `Your application for "${application.task.title}" has been accepted`,
      link: `/dashboard/student/tasks/${application.taskId}`,
    });

    return updatedApplication;
  }

  /**
   * Submit task work
   */
  async submitTask(
    taskId: string,
    studentId: string,
    description: string,
    submissionUrls: string[]
  ) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        organization: true,
      },
    });

    if (!task || task.status !== TaskStatus.IN_PROGRESS) {
      throw new Error('Cannot submit for this task');
    }

    // Check if student is accepted applicant
    const application = await prisma.taskApplication.findFirst({
      where: {
        taskId,
        studentId,
        status: ApplicationStatus.ACCEPTED,
      },
    });

    if (!application) {
      throw new Error('Not authorized to submit for this task');
    }

    // Create submission
    const submission = await prisma.taskSubmission.create({
      data: {
        taskId,
        studentId,
        description,
        submissionUrls,
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.SUBMITTED,
      },
    });

    // Notify organization
    await notificationService.createNotification({
      userId: task.organization.userId,
      type: 'TASK_SUBMITTED',
      title: 'Task Submitted',
      message: `Work has been submitted for: ${task.title}`,
      link: `/dashboard/organization/tasks/${taskId}`,
    });

    return submission;
  }

  /**
   * Approve task submission and release payment
   */
  async approveSubmission(
    taskId: string,
    organizationId: string,
    reviewNotes?: string
  ) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId,
      },
      include: {
        submission: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!task || !task.submission) {
      throw new Error('Task or submission not found');
    }

    // Update submission
    await prisma.taskSubmission.update({
      where: { id: task.submission.id },
      data: {
        isApproved: true,
        reviewNotes,
        reviewedAt: new Date(),
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    // Release escrow payment
    if (task.payment) {
      await paymentService.releaseEscrow(task.payment.id);
    }

    // Notify student
    await notificationService.createNotification({
      userId: task.submission.student.userId,
      type: 'TASK_APPROVED',
      title: 'Task Approved!',
      message: `Your work on "${task.title}" has been approved. Payment is being processed.`,
      link: `/dashboard/student/submissions/${task.submission.id}`,
    });

    return task;
  }

  /**
   * Notify students whose skills match the task
   */
  private async notifyMatchingStudents(task: any) {
    const students = await prisma.student.findMany({
      where: {
        skills: {
          some: {
            skillName: {
              in: task.skillsRequired,
            },
          },
        },
        user: {
          status: 'ACTIVE',
        },
      },
      include: {
        user: true,
      },
      take: 50, // Limit notifications
    });

    const notifications = students.map((student) =>
      notificationService.createNotification({
        userId: student.userId,
        type: 'TASK_POSTED',
        title: 'New Task Match',
        message: `A new task matching your skills has been posted: ${task.title}`,
        link: `/dashboard/student/tasks/${task.id}`,
      })
    );

    await Promise.all(notifications);
  }
}

export const taskService = new TaskService();
```

### 6.3 Validation Schemas

```typescript
// lib/validations/task.ts

import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  category: z.string().min(1),
  skillsRequired: z.array(z.string()).min(1).max(10),
  compensationAmount: z.number().positive().max(100000),
  compensationType: z.enum(['Tuition', 'Stipend', 'Scholarship']),
  deadline: z.date().min(new Date()),
  estimatedDuration: z.string().optional(),
  requirements: z.string().min(20).max(2000),
  deliverables: z.string().min(20).max(2000),
  maxApplicants: z.number().positive().optional(),
});

export const applyForTaskSchema = z.object({
  coverLetter: z.string().min(100).max(2000),
  proposedTimeline: z.string().max(500).optional(),
});

export const submitTaskSchema = z.object({
  description: z.string().min(50).max(2000),
  submissionUrls: z.array(z.string().url()).min(1).max(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ApplyForTaskInput = z.infer<typeof applyForTaskSchema>;
export type SubmitTaskInput = z.infer<typeof submitTaskSchema>;
```

---

## 7. Security Implementation

### 7.1 Authentication Middleware

```typescript
// lib/auth/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as AuthUser;
    
    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const user = await authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    return handler(request, context, user);
  };
}

export function requireRole(...roles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest, context: any) => {
      const user = await authenticateRequest(request);

      if (!user) {
        return NextResponse.json(
          { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
          { status: 403 }
        );
      }

      return handler(request, context, user);
    };
  };
}
```

### 7.2 Data Encryption

```typescript
// lib/security/encryption.ts

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 7.3 Rate Limiting

```typescript
// lib/security/rate-limit.ts

import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

// Usage in API route
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function checkRateLimit(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
  try {
    await limiter.check(10, ip); // 10 requests per minute
  } catch {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
}
```

---

## 8. Payment & Escrow System

### 8.1 Payment Service

```typescript
// lib/services/payment-service.ts

import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  /**
   * Create payment and hold in escrow
   */
  async createEscrowPayment(
    taskId: string,
    organizationId: string,
    amount: number
  ) {
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'ghs',
      metadata: {
        taskId,
        organizationId,
        type: 'escrow',
      },
      capture_method: 'manual', // Hold funds
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        taskId,
        organizationId,
        amount,
        currency: 'GHS',
        status: PaymentStatus.PENDING,
        paymentGateway: 'Stripe',
        gatewayTransactionId: paymentIntent.id,
      },
    });

    return {
      payment,
      clientSecret: paymentIntent.client_secret,
    };
  }

  /**
   * Hold payment in escrow after successful charge
   */
  async holdInEscrow(paymentId: string) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.HELD_IN_ESCROW,
        escrowHeldAt: new Date(),
      },
    });

    return payment;
  }

  /**
   * Release escrow funds to student
   */
  async releaseEscrow(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        task: {
          include: {
            submission: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.HELD_IN_ESCROW) {
      throw new Error('Payment is not in escrow');
    }

    // Capture the payment in Stripe
    if (payment.gatewayTransactionId) {
      await stripe.paymentIntents.capture(payment.gatewayTransactionId);
    }

    // In real implementation, transfer to school account
    // For now, just update status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.RELEASED,
        escrowReleasedAt: new Date(),
        disbursedAt: new Date(),
        recipientAccount: payment.task.submission?.student.bankAccountNumber || 'N/A',
        recipientName: payment.task.submission?.student.bankAccountName || 'N/A',
      },
    });

    return updatedPayment;
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, reason: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Create refund in Stripe
    if (payment.gatewayTransactionId) {
      await stripe.refunds.create({
        payment_intent: payment.gatewayTransactionId,
        reason: 'requested_by_customer',
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.REFUNDED,
      },
    });

    return updatedPayment;
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const payment = await prisma.payment.findFirst({
          where: {
            gatewayTransactionId: paymentIntent.id,
          },
        });

        if (payment) {
          await this.holdInEscrow(payment.id);
        }
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;

      // Handle other events
    }
  }
}

export const paymentService = new PaymentService();
```

---

## 9. Notification System

### 9.1 Notification Service

```typescript
// lib/services/notification-service.ts

import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';
import { emailService } from './email-service';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export class NotificationService {
  /**
   * Create notification
   */
  async createNotification(data: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data,
    });

    // Also send email for important notifications
    const emailTypes: NotificationType[] = [
      'APPLICATION_ACCEPTED',
      'TASK_APPROVED',
      'PAYMENT_RECEIVED',
    ];

    if (emailTypes.includes(data.type)) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true, firstName: true },
      });

      if (user) {
        await emailService.sendNotificationEmail({
          to: user.email,
          name: user.firstName,
          subject: data.title,
          message: data.message,
        });
      }
    }

    return notification;
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit: number = 20) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      notifications,
      unreadCount,
    };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return notification;
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result;
  }
}

export const notificationService = new NotificationService();
```

### 9.2 Email Service

```typescript
// lib/services/email-service.ts

import { Resend } from 'resend';
import {
  WelcomeEmail,
  TaskNotificationEmail,
  PaymentEmail,
} from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export class EmailService {
  private async sendEmail({ to, subject, react }: SendEmailOptions) {
    const { data, error } = await resend.emails.send({
      from: 'SkillFundr <noreply@skillfundr.com>',
      to,
      subject,
      react,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  }

  async sendWelcomeEmail(to: string, name: string, role: string) {
    return this.sendEmail({
      to,
      subject: 'Welcome to SkillFundr!',
      react: WelcomeEmail({ name, role }),
    });
  }

  async sendNotificationEmail({
    to,
    name,
    subject,
    message,
  }: {
    to: string;
    name: string;
    subject: string;
    message: string;
  }) {
    return this.sendEmail({
      to,
      subject,
      react: TaskNotificationEmail({ name, message }),
    });
  }

  async sendPaymentEmail({
    to,
    name,
    amount,
    taskTitle,
  }: {
    to: string;
    name: string;
    amount: number;
    taskTitle: string;
  }) {
    return this.sendEmail({
      to,
      subject: 'Payment Received',
      react: PaymentEmail({ name, amount, taskTitle }),
    });
  }
}

export const emailService = new EmailService();
```

---

## 10. File Structure

### 10.1 Complete Directory Structure

```
skillfundr/
├── .env
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── student/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── organization/
│   │   │   │       └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   ├── student/
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tasks/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── applications/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── submissions/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── earnings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── ratings/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── organization/
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── tasks/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── new/
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       ├── page.tsx
│   │   │   │   │   │       └── edit/
│   │   │   │   │   │           └── page.tsx
│   │   │   │   │   ├── applications/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── payments/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── ratings/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── overview/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── users/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── tasks/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── payments/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── analytics/
│   │   │   │           └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works/
│   │   │   │   └── page.tsx
│   │   │   ├── for-students/
│   │   │   │   └── page.tsx
│   │   │   ├── for-organizations/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-email/
│   │   │   │       └── route.ts
│   │   │   ├── users/
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── students/
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── skills/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── portfolio/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts
│   │   │   ├── organizations/
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify/
│   │   │   │       └── route.ts
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── publish/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── applications/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── apply/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── submit/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── approve/
│   │   │   │       │   └── route.ts
│   │   │   │       └── reject/
│   │   │   │           └── route.ts
│   │   │   ├── applications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── withdraw/
│   │   │   │       │   └── route.ts
│   │   │   │       ├── accept/
│   │   │   │       │   └── route.ts
│   │   │   │       └── reject/
│   │   │   │           └── route.ts
│   │   │   ├── payments/
│   │   │   │   ├── create/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   ├── release/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── refund/
│   │   │   │   │       └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   ├── ratings/
│   │   │   │   ├── route.ts
│   │   │   │   └── user/
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts
│   │   │   ├── notifications/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── read/
│   │   │   │   │       └── route.ts
│   │   │   │   └── mark-all-read/
│   │   │   │       └── route.ts
│   │   │   ├── admin/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── verify/
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       └── suspend/
│   │   │   │   │           └── route.ts
│   │   │   │   ├── tasks/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── payments/
│   │   │   │   │   └── route.ts
│   │   │   │   └── analytics/
│   │   │   │       └── route.ts
│   │   │   └── upload/
│   │   │       ├── image/
│   │   │       │   └── route.ts
│   │   │       └── document/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── mobile-menu.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── student-registration-form.tsx
│   │   │   ├── organization-registration-form.tsx
│   │   │   └── forgot-password-form.tsx
│   │   ├── dashboard/
│   │   │   ├── dashboard-header.tsx
│   │   │   ├── dashboard-sidebar.tsx
│   │   │   ├── stats-card.tsx
│   │   │   └── notifications-dropdown.tsx
│   │   ├── student/
│   │   │   ├── student-profile-card.tsx
│   │   │   ├── student-profile-form.tsx
│   │   │   ├── skill-list.tsx
│   │   │   ├── skill-form.tsx
│   │   │   ├── portfolio-grid.tsx
│   │   │   ├── portfolio-item.tsx
│   │   │   ├── portfolio-form.tsx
│   │   │   ├── application-card.tsx
│   │   │   └── application-list.tsx
│   │   ├── organization/
│   │   │   ├── organization-profile-card.tsx
│   │   │   ├── organization-profile-form.tsx
│   │   │   ├── task-form.tsx
│   │   │   └── application-review-card.tsx
│   │   ├── task/
│   │   │   ├── task-card.tsx
│   │   │   ├── task-list.tsx
│   │   │   ├── task-details.tsx
│   │   │   ├── task-filters.tsx
│   │   │   ├── task-search.tsx
│   │   │   ├── task-application-form.tsx
│   │   │   └── task-submission-form.tsx
│   │   ├── payment/
│   │   │   ├── payment-form.tsx
│   │   │   ├── payment-status.tsx
│   │   │   └── escrow-status.tsx
│   │   ├── rating/
│   │   │   ├── rating-form.tsx
│   │   │   ├── rating-display.tsx
│   │   │   └── rating-list.tsx
│   │   └── common/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       ├── loading-spinner.tsx
│   │       ├── pagination.tsx
│   │       ├── search-input.tsx
│   │       ├── file-upload.tsx
│   │       └── image-upload.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── utils.ts
│   │   ├── auth/
│   │   │   ├── auth.ts
│   │   │   ├── jwt.ts
│   │   │   └── password.ts
│   │   ├── services/
│   │   │   ├── auth-service.ts
│   │   │   ├── user-service.ts
│   │   │   ├── student-service.ts
│   │   │   ├── organization-service.ts
│   │   │   ├── task-service.ts
│   │   │   ├── application-service.ts
│   │   │   ├── payment-service.ts
│   │   │   ├── rating-service.ts
│   │   │   ├── notification-service.ts
│   │   │   ├── email-service.ts
│   │   │   └── upload-service.ts
│   │   ├── validations/
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── student.ts
│   │   │   ├── organization.ts
│   │   │   ├── task.ts
│   │   │   ├── application.ts
│   │   │   └── payment.ts
│   │   ├── security/
│   │   │   ├── encryption.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── sanitize.ts
│   │   └── constants/
│   │       ├── categories.ts
│   │       ├── skills.ts
│   │       └── statuses.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── task.ts
│   │   ├── payment.ts
│   │   └── api.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-user.ts
│   │   ├── use-tasks.ts
│   │   ├── use-notifications.ts
│   │   └── use-toast.ts
│   ├── context/
│   │   ├── auth-context.tsx
│   │   └── notification-context.tsx
│   └── emails/
│       ├── welcome-email.tsx
│       ├── task-notification-email.tsx
│       ├── payment-email.tsx
│       └── components/
│           ├── email-layout.tsx
│           └── email-button.tsx
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── API.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

### 10.2 Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillfundr"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
ENCRYPTION_KEY="64-char-hex-string-for-aes-256-encryption"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Payment
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OR Paystack for Ghana
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@skillfundr.com"

# File Upload
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."

# OR AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="skillfundr-uploads"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 11. Deployment Strategy

### 11.1 Hosting Recommendations

**Option 1: Vercel (Recommended)**
- Zero-config Next.js deployment
- Automatic HTTPS
- Global CDN
- Serverless functions
- Preview deployments

**Option 2: Railway/Render**
- Full-stack deployment
- PostgreSQL included
- Good for monolithic apps

### 11.2 Database Hosting
- **Neon** (Serverless Postgres)
- **Supabase** (Postgres + Auth)
- **PlanetScale** (MySQL alternative)
- **AWS RDS** (Production-grade)

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 12. Performance Optimization

### 12.1 Caching Strategy
- **Redis** for session storage
- **Next.js ISR** for static pages
- **SWR/React Query** for client-side caching
- **CDN** for static assets

### 12.2 Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling with Prisma
- Query optimization
- Database replication for reads

### 12.3 Image Optimization
- Next.js Image component
- WebP format
- Lazy loading
- Responsive images

---

## 13. Monitoring & Analytics

### 13.1 Error Tracking
- **Sentry** for error monitoring
- Custom error boundaries
- API error logging

### 13.2 Performance Monitoring
- **Vercel Analytics**
- **Web Vitals** tracking
- Custom performance metrics

### 13.3 User Analytics
- **Posthog** for product analytics
- Event tracking
- User journey analysis

---

## 14. Testing Strategy

### 14.1 Unit Tests
- Service layer tests
- Utility function tests
- Component tests

### 14.2 Integration Tests
- API route tests
- Database integration tests
- Service integration tests

### 14.3 E2E Tests
- Critical user flows
- Payment flows
- Task lifecycle tests

---

## Conclusion

This specification provides a complete blueprint for building the SkillFundr platform using Next.js 14 with a modern, scalable architecture. The system is designed to:

- Handle concurrent users efficiently
- Provide secure payment processing
- Scale horizontally as needed
- Maintain 99% uptime
- Comply with data protection requirements

**Next Steps:**
1. Set up development environment
2. Initialize database with Prisma
3. Implement authentication system
4. Build core features (Tasks, Applications, Payments)
5. Implement notification system
6. Add admin dashboard
7. Perform security audit
8. Load testing
9. Deploy to production

**Timeline Estimate:** 12-16 weeks for MVP with 2-3 developers


