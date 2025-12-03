import { PrismaClient, UserRole, UserStatus, TaskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional, comment out if you want to keep existing data)
  await prisma.taskSubmission.deleteMany();
  await prisma.taskApplication.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Hash password for all test accounts
  const hashedPassword = await bcrypt.hash('Test1234', 12);

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@skillfundr.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      admin: {
        create: {
          permissions: ['manage_users', 'manage_tasks', 'manage_payments'],
        },
      },
    },
  });
  console.log('✅ Created admin user');

  // Create Student Users
  const student1 = await prisma.user.create({
    data: {
      email: 'john.student@example.com',
      passwordHash: hashedPassword,
      firstName: 'John',
      lastName: 'Mensah',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      student: {
        create: {
          schoolName: 'University of Ghana',
          major: 'Computer Science',
          yearOfStudy: 3,
          tuitionFeeOutstanding: 5000,
          skills: {
            create: [
              {
                skillName: 'Web Development',
                level: 'Advanced',
                yearsOfExperience: 2,
              },
              {
                skillName: 'UI/UX Design',
                level: 'Intermediate',
                yearsOfExperience: 1,
              },
              {
                skillName: 'React',
                level: 'Advanced',
                yearsOfExperience: 2,
              },
            ],
          },
          portfolioItems: {
            create: [
              {
                title: 'E-commerce Website',
                description: 'Built a full-stack e-commerce platform using React and Node.js',
                url: 'https://example.com/project1',
                category: 'Web Development',
              },
              {
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
      email: 'sarah.student@example.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Osei',
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      student: {
        create: {
          schoolName: 'Kwame Nkrumah University of Science and Technology',
          major: 'Graphic Design',
          yearOfStudy: 2,
          tuitionFeeOutstanding: 4000,
          skills: {
            create: [
              {
                skillName: 'Graphic Design',
                level: 'Expert',
                yearsOfExperience: 3,
              },
              {
                skillName: 'Content Writing',
                level: 'Advanced',
                yearsOfExperience: 2,
              },
              {
                skillName: 'Social Media Management',
                level: 'Intermediate',
                yearsOfExperience: 1,
              },
            ],
          },
        },
      },
    },
  });
  console.log('✅ Created 2 student users');

  // Create Organization Users
  const org1 = await prisma.user.create({
    data: {
      email: 'tech.ngo@example.com',
      passwordHash: hashedPassword,
      firstName: 'David',
      lastName: 'Akoto',
      role: UserRole.ORGANIZATION,
      status: UserStatus.ACTIVE,
      organization: {
        create: {
          organizationName: 'Tech for Good Ghana',
          organizationType: 'NGO',
          contactPerson: 'David Akoto',
          contactEmail: 'contact@techforgood.org',
          contactPhone: '+233244567890',
          description:
            'A nonprofit organization dedicated to empowering Ghanaian youth through technology education and digital skills training. We partner with schools and communities to bridge the digital divide.',
          isVerified: true,
        },
      },
    },
  });

  const org2 = await prisma.user.create({
    data: {
      email: 'startup@example.com',
      passwordHash: hashedPassword,
      firstName: 'Grace',
      lastName: 'Antwi',
      role: UserRole.ORGANIZATION,
      status: UserStatus.ACTIVE,
      organization: {
        create: {
          organizationName: 'GhanaFintech Solutions',
          organizationType: 'Startup',
          contactPerson: 'Grace Antwi',
          contactEmail: 'info@ghanafintech.com',
          contactPhone: '+233201234567',
          description:
            'A fast-growing fintech startup revolutionizing mobile payments and financial services in Ghana. We are looking for talented students to help us build the future of finance in Africa.',
          website: 'https://ghanafintech.com',
          isVerified: true,
        },
      },
    },
  });
  console.log('✅ Created 2 organization users');

  // Create Sample Tasks
  const org1Data = await prisma.organization.findUnique({
    where: { userId: org1.id },
  });

  const org2Data = await prisma.organization.findUnique({
    where: { userId: org2.id },
  });

  if (org1Data) {
    await prisma.task.create({
      data: {
        organizationId: org1Data.id,
        title: 'Build a Website for Youth Education Program',
        description:
          'We need a modern, responsive website for our youth education program. The site should include information about our programs, success stories, and a contact form. Should be built with React or Next.js.',
        category: 'Web Development',
        skillsRequired: ['Web Development', 'React', 'UI/UX Design'],
        compensationAmount: 2000,
        compensationType: 'Tuition',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        estimatedDuration: '3 weeks',
        requirements:
          'Must have experience with React or Next.js. Portfolio showing previous web projects required. Good communication skills.',
        deliverables:
          'Fully functional website, responsive design, contact form integration, deployed to hosting platform, documentation.',
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
        attachmentUrls: [],
      },
    });

    await prisma.task.create({
      data: {
        organizationId: org1Data.id,
        title: 'Social Media Content Creation',
        description:
          'Create engaging social media content (graphics and captions) for our Facebook, Twitter, and Instagram accounts. Content should promote our tech training programs.',
        category: 'Social Media Management',
        skillsRequired: ['Graphic Design', 'Content Writing', 'Social Media Management'],
        compensationAmount: 800,
        compensationType: 'Stipend',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        estimatedDuration: '2 weeks',
        requirements:
          'Experience with Adobe Photoshop or Canva. Understanding of social media best practices. Creative thinking.',
        deliverables:
          '20 social media posts (graphics + captions), content calendar, hashtag strategy.',
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
        attachmentUrls: [],
      },
    });
  }

  if (org2Data) {
    await prisma.task.create({
      data: {
        organizationId: org2Data.id,
        title: 'Mobile App UI/UX Design',
        description:
          'Design user interface for our new mobile banking app. We need modern, intuitive designs that follow mobile-first principles and accessibility standards.',
        category: 'UI/UX Design',
        skillsRequired: ['UI/UX Design', 'Mobile Design', 'Figma'],
        compensationAmount: 3000,
        compensationType: 'Tuition',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        estimatedDuration: '4 weeks',
        requirements:
          'Proficiency in Figma or Adobe XD. Portfolio of mobile app designs. Understanding of fintech industry.',
        deliverables:
          'Complete UI designs (15+ screens), user flow diagrams, design system, interactive prototype.',
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
        attachmentUrls: [],
      },
    });

    await prisma.task.create({
      data: {
        organizationId: org2Data.id,
        title: 'Content Writing for Blog',
        description:
          'Write 10 blog articles about fintech trends, mobile payments, and financial literacy in Ghana. Each article should be 800-1200 words.',
        category: 'Content Writing',
        skillsRequired: ['Content Writing', 'Research'],
        compensationAmount: 1500,
        compensationType: 'Scholarship',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        estimatedDuration: '3 weeks',
        requirements:
          'Excellent English writing skills. Research capability. Understanding of finance and technology.',
        deliverables:
          '10 well-researched blog articles, SEO-optimized, with relevant images suggested.',
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
        attachmentUrls: [],
      },
    });
  }

  console.log('✅ Created 4 sample tasks');

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📧 Test Accounts Created:\n');
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
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

