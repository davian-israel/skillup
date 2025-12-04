const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Setting up database...\n');

  try {
    // Clean up existing data
    console.log('🧹 Cleaning up existing data...');
    await prisma.$executeRaw`TRUNCATE TABLE "Notification" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Rating" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Payment" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "TaskSubmission" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "TaskApplication" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Task" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "PortfolioItem" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "StudentSkill" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Admin" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Organization" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "Student" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    console.log('✅ Cleaned up\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('Test1234', 12);

    // Create Admin
    console.log('👨‍💼 Creating admin account...');
    const admin = await prisma.user.create({
      data: {
        id: 'admin001',
        email: 'admin@skillfundr.com',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        status: 'ACTIVE',
        admin: {
          create: {
            id: 'adm001',
            permissions: ['manage_users', 'manage_tasks', 'manage_payments'],
          },
        },
      },
    });
    console.log('✅ Admin created\n');

    // Create Students
    console.log('👨‍🎓 Creating student accounts...');
    const student1 = await prisma.user.create({
      data: {
        id: 'user001',
        email: 'john.student@example.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Mensah',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            id: 'stu001',
            schoolName: 'University of Ghana',
            major: 'Computer Science',
            yearOfStudy: 3,
            tuitionFeeOutstanding: 5000,
            skills: {
              create: [
                { id: 'skl001', skillName: 'Web Development', level: 'Advanced', yearsOfExperience: 2 },
                { id: 'skl002', skillName: 'UI/UX Design', level: 'Intermediate', yearsOfExperience: 1 },
                { id: 'skl003', skillName: 'React', level: 'Advanced', yearsOfExperience: 2 },
              ],
            },
            portfolioItems: {
              create: [
                {
                  id: 'prt001',
                  title: 'E-commerce Website',
                  description: 'Built a full-stack e-commerce platform using React and Node.js',
                  url: 'https://example.com/project1',
                  category: 'Web Development',
                },
                {
                  id: 'prt002',
                  title: 'Mobile App UI Design',
                  description: 'Designed user interface for a fintech mobile application',
                  category: 'UI/UX Design',
                },
              ],
            },
          },
        },
      },
    });

    const student2 = await prisma.user.create({
      data: {
        id: 'user002',
        email: 'sarah.student@example.com',
        passwordHash: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Osei',
        role: 'STUDENT',
        status: 'ACTIVE',
        student: {
          create: {
            id: 'stu002',
            schoolName: 'Kwame Nkrumah University of Science and Technology',
            major: 'Graphic Design',
            yearOfStudy: 2,
            tuitionFeeOutstanding: 4000,
            skills: {
              create: [
                { id: 'skl004', skillName: 'Graphic Design', level: 'Expert', yearsOfExperience: 3 },
                { id: 'skl005', skillName: 'Content Writing', level: 'Advanced', yearsOfExperience: 2 },
                { id: 'skl006', skillName: 'Social Media Management', level: 'Intermediate', yearsOfExperience: 1 },
              ],
            },
          },
        },
      },
    });
    console.log('✅ 2 students created\n');

    // Create Organizations
    console.log('🏢 Creating organization accounts...');
    const org1 = await prisma.user.create({
      data: {
        id: 'user003',
        email: 'tech.ngo@example.com',
        passwordHash: hashedPassword,
        firstName: 'David',
        lastName: 'Akoto',
        role: 'ORGANIZATION',
        status: 'ACTIVE',
        organization: {
          create: {
            id: 'org001',
            organizationName: 'Tech for Good Ghana',
            organizationType: 'NGO',
            contactPerson: 'David Akoto',
            contactEmail: 'contact@techforgood.org',
            contactPhone: '+233244567890',
            description: 'A nonprofit organization dedicated to empowering Ghanaian youth through technology education and digital skills training.',
            isVerified: true,
          },
        },
      },
    });

    const org2 = await prisma.user.create({
      data: {
        id: 'user004',
        email: 'startup@example.com',
        passwordHash: hashedPassword,
        firstName: 'Grace',
        lastName: 'Antwi',
        role: 'ORGANIZATION',
        status: 'ACTIVE',
        organization: {
          create: {
            id: 'org002',
            organizationName: 'GhanaFintech Solutions',
            organizationType: 'Startup',
            contactPerson: 'Grace Antwi',
            contactEmail: 'info@ghanafintech.com',
            contactPhone: '+233201234567',
            description: 'A fast-growing fintech startup revolutionizing mobile payments and financial services in Ghana.',
            website: 'https://ghanafintech.com',
            isVerified: true,
          },
        },
      },
    });
    console.log('✅ 2 organizations created\n');

    // Create Tasks
    console.log('📋 Creating sample tasks...');
    const tasks = await Promise.all([
      prisma.task.create({
        data: {
          id: 'tsk001',
          organizationId: 'org001',
          title: 'Build a Website for Youth Education Program',
          description: 'We need a modern, responsive website for our youth education program. The site should include information about our programs, success stories, and a contact form.',
          category: 'Web Development',
          skillsRequired: ['Web Development', 'React', 'UI/UX Design'],
          compensationAmount: 2000,
          compensationType: 'Tuition',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          estimatedDuration: '3 weeks',
          requirements: 'Must have experience with React or Next.js. Portfolio showing previous web projects required.',
          deliverables: 'Fully functional website, responsive design, contact form integration, deployed to hosting platform.',
          status: 'OPEN',
          publishedAt: new Date(),
          attachmentUrls: [],
        },
      }),
      prisma.task.create({
        data: {
          id: 'tsk002',
          organizationId: 'org001',
          title: 'Social Media Content Creation',
          description: 'Create engaging social media content (graphics and captions) for our Facebook, Twitter, and Instagram accounts.',
          category: 'Social Media Management',
          skillsRequired: ['Graphic Design', 'Content Writing', 'Social Media Management'],
          compensationAmount: 800,
          compensationType: 'Stipend',
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          estimatedDuration: '2 weeks',
          requirements: 'Experience with Adobe Photoshop or Canva. Understanding of social media best practices.',
          deliverables: '20 social media posts (graphics + captions), content calendar, hashtag strategy.',
          status: 'OPEN',
          publishedAt: new Date(),
          attachmentUrls: [],
        },
      }),
      prisma.task.create({
        data: {
          id: 'tsk003',
          organizationId: 'org002',
          title: 'Mobile App UI/UX Design',
          description: 'Design user interface for our new mobile banking app. We need modern, intuitive designs that follow mobile-first principles.',
          category: 'UI/UX Design',
          skillsRequired: ['UI/UX Design', 'Mobile Design', 'Figma'],
          compensationAmount: 3000,
          compensationType: 'Tuition',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          estimatedDuration: '4 weeks',
          requirements: 'Proficiency in Figma or Adobe XD. Portfolio of mobile app designs.',
          deliverables: 'Complete UI designs (15+ screens), user flow diagrams, design system, interactive prototype.',
          status: 'OPEN',
          publishedAt: new Date(),
          attachmentUrls: [],
        },
      }),
      prisma.task.create({
        data: {
          id: 'tsk004',
          organizationId: 'org002',
          title: 'Content Writing for Blog',
          description: 'Write 10 blog articles about fintech trends, mobile payments, and financial literacy in Ghana. Each article should be 800-1200 words.',
          category: 'Content Writing',
          skillsRequired: ['Content Writing', 'Research'],
          compensationAmount: 1500,
          compensationType: 'Scholarship',
          deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          estimatedDuration: '3 weeks',
          requirements: 'Excellent English writing skills. Research capability.',
          deliverables: '10 well-researched blog articles, SEO-optimized, with relevant images suggested.',
          status: 'OPEN',
          publishedAt: new Date(),
          attachmentUrls: [],
        },
      }),
    ]);
    console.log('✅ 4 tasks created\n');

    console.log('✨ Database setup complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📧 Test Accounts Created:\n');
    console.log('👨‍💼 Admin Account:');
    console.log('   Email: admin@skillfundr.com');
    console.log('   Password: Test1234\n');
    console.log('👨‍🎓 Student Accounts:');
    console.log('   Email: john.student@example.com');
    console.log('   Password: Test1234');
    console.log('   Email: sarah.student@example.com');
    console.log('   Password: Test1234\n');
    console.log('🏢 Organization Accounts:');
    console.log('   Email: tech.ngo@example.com');
    console.log('   Password: Test1234');
    console.log('   Email: startup@example.com');
    console.log('   Password: Test1234\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 You can now run: npm run dev\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



