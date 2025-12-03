-- SkillFundr Database Setup Script
-- Run this directly in your PostgreSQL database

-- Drop existing tables if they exist (optional - comment out if you want to keep data)
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "TaskSubmission" CASCADE;
DROP TABLE IF EXISTS "TaskApplication" CASCADE;
DROP TABLE IF EXISTS "Task" CASCADE;
DROP TABLE IF EXISTS "PortfolioItem" CASCADE;
DROP TABLE IF EXISTS "StudentSkill" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;
DROP TABLE IF EXISTS "Organization" CASCADE;
DROP TABLE IF EXISTS "Student" CASCADE;
DROP TABLE IF EXISTS "UniversityPartner" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "UserStatus" CASCADE;
DROP TYPE IF EXISTS "TaskStatus" CASCADE;
DROP TYPE IF EXISTS "ApplicationStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;

-- Create Enums
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ORGANIZATION', 'ADMIN', 'UNIVERSITY');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED');
CREATE TYPE "TaskStatus" AS ENUM ('DRAFT', 'OPEN', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD_IN_ESCROW', 'RELEASED', 'REFUNDED', 'FAILED');
CREATE TYPE "NotificationType" AS ENUM ('TASK_POSTED', 'APPLICATION_RECEIVED', 'APPLICATION_ACCEPTED', 'APPLICATION_REJECTED', 'TASK_SUBMITTED', 'TASK_APPROVED', 'PAYMENT_RECEIVED', 'RATING_RECEIVED', 'SYSTEM_ALERT');

-- Create Tables
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "lastLoginAt" TIMESTAMP
);

CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "schoolName" TEXT NOT NULL,
    "studentId" TEXT,
    "major" TEXT,
    "yearOfStudy" INTEGER,
    "expectedGraduation" TIMESTAMP,
    "tuitionFeeOutstanding" DECIMAL(10,2),
    "bankAccountName" TEXT,
    "bankAccountNumber" TEXT,
    "bankName" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDocUrl" TEXT,
    "universityPartnerId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "StudentSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "yearsOfExperience" DOUBLE PRECISION,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
);

CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "imageUrl" TEXT,
    "fileUrl" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "organizationName" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "website" TEXT,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "address" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDocUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "permissions" TEXT[],
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "skillsRequired" TEXT[],
    "compensationAmount" DECIMAL(10,2) NOT NULL,
    "compensationType" TEXT NOT NULL,
    "deadline" TIMESTAMP NOT NULL,
    "estimatedDuration" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'DRAFT',
    "maxApplicants" INTEGER,
    "requirements" TEXT NOT NULL,
    "deliverables" TEXT NOT NULL,
    "attachmentUrls" TEXT[],
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "publishedAt" TIMESTAMP,
    "completedAt" TIMESTAMP,
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

CREATE TABLE "TaskApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "proposedTimeline" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
    UNIQUE("taskId", "studentId")
);

CREATE TABLE "TaskSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL UNIQUE,
    "studentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "submissionUrls" TEXT[],
    "isApproved" BOOLEAN,
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP,
    "submittedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE,
    FOREIGN KEY ("studentId") REFERENCES "Student"("id")
);

CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL UNIQUE,
    "organizationId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GHS',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "escrowHeldAt" TIMESTAMP,
    "escrowReleasedAt" TIMESTAMP,
    "paymentGateway" TEXT,
    "gatewayTransactionId" TEXT,
    "recipientAccount" TEXT,
    "recipientName" TEXT,
    "disbursedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("taskId") REFERENCES "Task"("id"),
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
);

CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "category" TEXT[],
    "taskId" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("fromUserId") REFERENCES "User"("id"),
    FOREIGN KEY ("toUserId") REFERENCES "User"("id"),
    UNIQUE("fromUserId", "toUserId", "taskId")
);

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "UniversityPartner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "contactPerson" TEXT NOT NULL,
    "contactPhone" TEXT,
    "address" TEXT,
    "apiKey" TEXT UNIQUE,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL
);

-- Create Indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Student_userId_idx" ON "Student"("userId");
CREATE INDEX "Student_universityPartnerId_idx" ON "Student"("universityPartnerId");
CREATE INDEX "StudentSkill_studentId_idx" ON "StudentSkill"("studentId");
CREATE INDEX "PortfolioItem_studentId_idx" ON "PortfolioItem"("studentId");
CREATE INDEX "Organization_userId_idx" ON "Organization"("userId");
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");
CREATE INDEX "Task_status_idx" ON "Task"("status");
CREATE INDEX "Task_category_idx" ON "Task"("category");
CREATE INDEX "TaskApplication_taskId_idx" ON "TaskApplication"("taskId");
CREATE INDEX "TaskApplication_studentId_idx" ON "TaskApplication"("studentId");
CREATE INDEX "TaskApplication_status_idx" ON "TaskApplication"("status");
CREATE INDEX "TaskSubmission_taskId_idx" ON "TaskSubmission"("taskId");
CREATE INDEX "TaskSubmission_studentId_idx" ON "TaskSubmission"("studentId");
CREATE INDEX "Payment_taskId_idx" ON "Payment"("taskId");
CREATE INDEX "Payment_organizationId_idx" ON "Payment"("organizationId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Rating_toUserId_idx" ON "Rating"("toUserId");
CREATE INDEX "Rating_fromUserId_idx" ON "Rating"("fromUserId");
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
CREATE INDEX "UniversityPartner_email_idx" ON "UniversityPartner"("email");

-- Add Foreign Key for Student -> UniversityPartner
ALTER TABLE "Student" ADD CONSTRAINT "Student_universityPartnerId_fkey" 
    FOREIGN KEY ("universityPartnerId") REFERENCES "UniversityPartner"("id");

-- Insert Test Data

-- Admin User
INSERT INTO "User" ("id", "email", "passwordHash", "role", "status", "firstName", "lastName", "createdAt", "updatedAt")
VALUES 
('admin001', 'admin@skillfundr.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2', 'ADMIN', 'ACTIVE', 'Admin', 'User', NOW(), NOW());

INSERT INTO "Admin" ("id", "userId", "permissions", "createdAt", "updatedAt")
VALUES 
('adm001', 'admin001', ARRAY['manage_users', 'manage_tasks', 'manage_payments'], NOW(), NOW());

-- Student Users
INSERT INTO "User" ("id", "email", "passwordHash", "role", "status", "firstName", "lastName", "createdAt", "updatedAt")
VALUES 
('user001', 'john.student@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2', 'STUDENT', 'ACTIVE', 'John', 'Mensah', NOW(), NOW()),
('user002', 'sarah.student@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2', 'STUDENT', 'ACTIVE', 'Sarah', 'Osei', NOW(), NOW());

INSERT INTO "Student" ("id", "userId", "schoolName", "major", "yearOfStudy", "tuitionFeeOutstanding", "createdAt", "updatedAt")
VALUES 
('stu001', 'user001', 'University of Ghana', 'Computer Science', 3, 5000, NOW(), NOW()),
('stu002', 'user002', 'Kwame Nkrumah University of Science and Technology', 'Graphic Design', 2, 4000, NOW(), NOW());

-- Student Skills
INSERT INTO "StudentSkill" ("id", "studentId", "skillName", "level", "yearsOfExperience", "createdAt")
VALUES 
('skl001', 'stu001', 'Web Development', 'Advanced', 2, NOW()),
('skl002', 'stu001', 'UI/UX Design', 'Intermediate', 1, NOW()),
('skl003', 'stu001', 'React', 'Advanced', 2, NOW()),
('skl004', 'stu002', 'Graphic Design', 'Expert', 3, NOW()),
('skl005', 'stu002', 'Content Writing', 'Advanced', 2, NOW()),
('skl006', 'stu002', 'Social Media Management', 'Intermediate', 1, NOW());

-- Portfolio Items
INSERT INTO "PortfolioItem" ("id", "studentId", "title", "description", "url", "category", "createdAt", "updatedAt")
VALUES 
('prt001', 'stu001', 'E-commerce Website', 'Built a full-stack e-commerce platform using React and Node.js', 'https://example.com/project1', 'Web Development', NOW(), NOW()),
('prt002', 'stu001', 'Mobile App UI Design', 'Designed user interface for a fintech mobile application', 'UI/UX Design', NOW(), NOW());

-- Organization Users
INSERT INTO "User" ("id", "email", "passwordHash", "role", "status", "firstName", "lastName", "createdAt", "updatedAt")
VALUES 
('user003', 'tech.ngo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2', 'ORGANIZATION', 'ACTIVE', 'David', 'Akoto', NOW(), NOW()),
('user004', 'startup@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIUInYx/y2', 'ORGANIZATION', 'ACTIVE', 'Grace', 'Antwi', NOW(), NOW());

INSERT INTO "Organization" ("id", "userId", "organizationName", "organizationType", "contactPerson", "contactEmail", "contactPhone", "description", "isVerified", "createdAt", "updatedAt")
VALUES 
('org001', 'user003', 'Tech for Good Ghana', 'NGO', 'David Akoto', 'contact@techforgood.org', '+233244567890', 
 'A nonprofit organization dedicated to empowering Ghanaian youth through technology education and digital skills training. We partner with schools and communities to bridge the digital divide.', 
 true, NOW(), NOW()),
('org002', 'user004', 'GhanaFintech Solutions', 'Startup', 'Grace Antwi', 'info@ghanafintech.com', '+233201234567',
 'A fast-growing fintech startup revolutionizing mobile payments and financial services in Ghana. We are looking for talented students to help us build the future of finance in Africa.',
 true, NOW(), NOW());

-- Tasks
INSERT INTO "Task" ("id", "organizationId", "title", "description", "category", "skillsRequired", "compensationAmount", "compensationType", "deadline", "estimatedDuration", "requirements", "deliverables", "status", "publishedAt", "attachmentUrls", "createdAt", "updatedAt")
VALUES 
('tsk001', 'org001', 'Build a Website for Youth Education Program', 
 'We need a modern, responsive website for our youth education program. The site should include information about our programs, success stories, and a contact form. Should be built with React or Next.js.',
 'Web Development', 
 ARRAY['Web Development', 'React', 'UI/UX Design'],
 2000, 'Tuition', 
 NOW() + INTERVAL '30 days', 
 '3 weeks',
 'Must have experience with React or Next.js. Portfolio showing previous web projects required. Good communication skills.',
 'Fully functional website, responsive design, contact form integration, deployed to hosting platform, documentation.',
 'OPEN', NOW(), ARRAY[]::TEXT[], NOW(), NOW()),

('tsk002', 'org001', 'Social Media Content Creation',
 'Create engaging social media content (graphics and captions) for our Facebook, Twitter, and Instagram accounts. Content should promote our tech training programs.',
 'Social Media Management',
 ARRAY['Graphic Design', 'Content Writing', 'Social Media Management'],
 800, 'Stipend',
 NOW() + INTERVAL '14 days',
 '2 weeks',
 'Experience with Adobe Photoshop or Canva. Understanding of social media best practices. Creative thinking.',
 '20 social media posts (graphics + captions), content calendar, hashtag strategy.',
 'OPEN', NOW(), ARRAY[]::TEXT[], NOW(), NOW()),

('tsk003', 'org002', 'Mobile App UI/UX Design',
 'Design user interface for our new mobile banking app. We need modern, intuitive designs that follow mobile-first principles and accessibility standards.',
 'UI/UX Design',
 ARRAY['UI/UX Design', 'Mobile Design', 'Figma'],
 3000, 'Tuition',
 NOW() + INTERVAL '45 days',
 '4 weeks',
 'Proficiency in Figma or Adobe XD. Portfolio of mobile app designs. Understanding of fintech industry.',
 'Complete UI designs (15+ screens), user flow diagrams, design system, interactive prototype.',
 'OPEN', NOW(), ARRAY[]::TEXT[], NOW(), NOW()),

('tsk004', 'org002', 'Content Writing for Blog',
 'Write 10 blog articles about fintech trends, mobile payments, and financial literacy in Ghana. Each article should be 800-1200 words.',
 'Content Writing',
 ARRAY['Content Writing', 'Research'],
 1500, 'Scholarship',
 NOW() + INTERVAL '21 days',
 '3 weeks',
 'Excellent English writing skills. Research capability. Understanding of finance and technology.',
 '10 well-researched blog articles, SEO-optimized, with relevant images suggested.',
 'OPEN', NOW(), ARRAY[]::TEXT[], NOW(), NOW());

-- Success message
SELECT 'Database setup complete! Test accounts created with password: Test1234' AS "Message";
SELECT 'Admin: admin@skillfundr.com' AS "Admin Account";
SELECT 'Students: john.student@example.com, sarah.student@example.com' AS "Student Accounts";
SELECT 'Organizations: tech.ngo@example.com, startup@example.com' AS "Organization Accounts";


