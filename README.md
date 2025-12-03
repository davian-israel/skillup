# SkillFundr - Connect Students with Opportunity

A digital marketplace connecting financially constrained students with NGOs, startups, and small businesses needing skilled services. Students complete tasks in exchange for tuition support, stipends, or scholarship contributions.

## 📋 Documentation

- **[Technical Specification](./TECHNICAL_SPECIFICATION.md)** - Complete system architecture and implementation details
- **[Requirements](./requirement.md)** - Original software requirements specification

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MVP
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**

Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/skillfundr"
JWT_SECRET="8f3a9d5c7e1b4f6a8c0d2e5f7a9b1c3d4e6f8a0b2c4d6e8f0a1b3c5d7e9f1a3b"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="7b2a4e8f1c5d9a6b3e7f0c4a8d2f6b9e1c5a7d3f9b0e4a6c8d1f5b7a9c3e5f1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

4. **Set up the database**
```bash
# Create PostgreSQL database
createdb skillfundr

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database with test accounts
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Test Accounts

The seeded database includes the following test accounts (all use password: **Test1234**):

### Admin Account
- **Email:** admin@skillfundr.com
- **Password:** Test1234
- **Access:** Full system administration

### Student Accounts
1. **John Mensah** (Computer Science Student)
   - **Email:** john.student@example.com
   - **Password:** Test1234
   - **School:** University of Ghana
   - **Skills:** Web Development, UI/UX Design, React

2. **Sarah Osei** (Graphic Design Student)
   - **Email:** sarah.student@example.com
   - **Password:** Test1234
   - **School:** KNUST
   - **Skills:** Graphic Design, Content Writing, Social Media

### Organization Accounts
1. **Tech for Good Ghana** (NGO)
   - **Email:** tech.ngo@example.com
   - **Password:** Test1234
   - **Type:** NGO
   - **Tasks:** 2 posted tasks

2. **GhanaFintech Solutions** (Startup)
   - **Email:** startup@example.com
   - **Password:** Test1234
   - **Type:** Startup
   - **Tasks:** 2 posted tasks

Use these accounts to explore different user roles and features!

## 🏗️ Tech Stack

### Core
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3+
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5

### Frontend
- **Styling:** Tailwind CSS
- **Components:** Shadcn UI + Radix UI
- **Forms:** React Hook Form + Zod
- **State:** nuqs (URL state) + React Context

### Backend
- **API:** Next.js Route Handlers (REST)
- **Validation:** Zod schemas
- **Email:** Resend + React Email
- **Payments:** Stripe / Paystack

### DevOps
- **Hosting:** Vercel (recommended)
- **Database:** Neon / Supabase
- **Monitoring:** Sentry + Vercel Analytics
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```
skillfundr/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   ├── (public)/     # Public pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # Shadcn UI components
│   │   ├── layout/       # Layout components
│   │   ├── auth/         # Auth components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── student/      # Student components
│   │   ├── organization/ # Organization components
│   │   ├── task/         # Task components
│   │   └── common/       # Shared components
│   ├── lib/              # Utilities and business logic
│   │   ├── services/     # Business logic services
│   │   ├── validations/  # Zod schemas
│   │   ├── auth/         # Auth utilities
│   │   └── security/     # Security utilities
│   ├── types/            # TypeScript types
│   ├── hooks/            # React hooks
│   └── context/          # React contexts
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/               # Static assets
└── tests/                # Test files
```

## 🔑 Key Features

### For Students
- Create profile with skills and portfolio
- Browse and apply for tasks
- Submit work and receive feedback
- Track earnings and applications
- Receive tuition payments directly to school

### For Organizations
- Post tasks with compensation details
- Review and accept applications
- Approve submissions
- Rate students
- Manage payments via escrow

### For Admins
- User verification and management
- Task moderation
- Payment oversight
- Analytics dashboard
- System monitoring

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev    # Create migration
npx prisma generate  # Generate Prisma client
npx prisma db seed   # Seed database

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
```

### Code Style

This project follows strict TypeScript and React best practices:
- Functional components with hooks
- Server components by default
- Type-safe API routes
- Zod validation for all inputs
- Mobile-first responsive design

## 🔒 Security

- HTTPS enforced in production
- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection via Prisma
- CSRF protection
- Rate limiting on API routes
- Data encryption for sensitive information
- Security headers configured

## 📊 Database Schema

See [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md#3-database-schema) for complete database schema with:
- Users (Students, Organizations, Admins)
- Tasks and Applications
- Payments and Escrow
- Ratings and Reviews
- Notifications

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

Set up PostgreSQL database and configure all environment variables.

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Performance

- Server-side rendering for optimal SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Redis caching for sessions
- CDN for static assets
- Database query optimization

## 🌍 Localization

Currently supports:
- English (default)
- Future: Twi, Ga, Ewe (Ghanaian languages)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 👥 Team

- **Development Team:** [Your Team]
- **Project Manager:** [Name]
- **Technical Lead:** [Name]

## 📧 Contact

For questions or support, contact: support@skillfundr.com

## 🗺️ Roadmap

### Phase 1 - MVP (Weeks 1-8)
- [ ] Authentication system
- [ ] Student profiles
- [ ] Organization profiles
- [ ] Task posting and browsing
- [ ] Application system
- [ ] Basic payment integration

### Phase 2 - Core Features (Weeks 9-12)
- [ ] Escrow payment system
- [ ] Rating and review system
- [ ] Notification system
- [ ] Admin dashboard
- [ ] Email notifications

### Phase 3 - Enhancement (Weeks 13-16)
- [ ] University partner integration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search and filtering

### Future Enhancements
- [ ] Video interviews
- [ ] Skill assessments
- [ ] Mentorship program
- [ ] Community forum
- [ ] API for third-party integrations

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)

---

Built with ❤️ for students in Ghana


