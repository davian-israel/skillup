import { prisma } from '@/lib/prisma';
import { TaskStatus, ApplicationStatus } from '@prisma/client';
import type { CreateTaskInput, ApplyForTaskInput, SubmitTaskInput } from '../validations/task';

interface TaskFilters {
  category?: string;
  skills?: string;
  minCompensation?: number;
  maxCompensation?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export class TaskService {
  async createTask(organizationId: string, data: CreateTaskInput) {
    const task = await prisma.task.create({
      data: {
        organizationId,
        title: data.title,
        description: data.description,
        category: data.category,
        skillsRequired: data.skillsRequired,
        compensationAmount: data.compensationAmount,
        compensationType: data.compensationType,
        deadline: new Date(data.deadline),
        estimatedDuration: data.estimatedDuration,
        requirements: data.requirements,
        deliverables: data.deliverables,
        maxApplicants: data.maxApplicants,
        status: TaskStatus.DRAFT,
        attachmentUrls: [],
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

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.OPEN,
        publishedAt: new Date(),
      },
    });

    return updatedTask;
  }

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

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
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

  async getTaskById(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        organization: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async getOrganizationTasks(organizationId: string) {
    const tasks = await prisma.task.findMany({
      where: { organizationId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return tasks;
  }

  async applyForTask(taskId: string, studentId: string, data: ApplyForTaskInput) {
    // Check if task exists and is open
    const task = await prisma.task.findUnique({
      where: { id: taskId },
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
        coverLetter: data.coverLetter,
        proposedTimeline: data.proposedTimeline,
        status: ApplicationStatus.PENDING,
      },
    });

    return application;
  }

  async getStudentApplications(studentId: string) {
    const applications = await prisma.taskApplication.findMany({
      where: { studentId },
      orderBy: {
        appliedAt: 'desc',
      },
      include: {
        task: {
          include: {
            organization: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return applications;
  }

  async getTaskApplications(taskId: string, organizationId: string) {
    // Verify task ownership
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId,
      },
    });

    if (!task) {
      throw new Error('Task not found or unauthorized');
    }

    const applications = await prisma.taskApplication.findMany({
      where: { taskId },
      orderBy: {
        appliedAt: 'desc',
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
            skills: true,
          },
        },
      },
    });

    return applications;
  }

  async acceptApplication(applicationId: string, organizationId: string) {
    const application = await prisma.taskApplication.findUnique({
      where: { id: applicationId },
      include: {
        task: true,
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

    return updatedApplication;
  }

  async rejectApplication(applicationId: string, organizationId: string) {
    const application = await prisma.taskApplication.findUnique({
      where: { id: applicationId },
      include: {
        task: true,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.task.organizationId !== organizationId) {
      throw new Error('Unauthorized');
    }

    const updatedApplication = await prisma.taskApplication.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.REJECTED,
        reviewedAt: new Date(),
      },
    });

    return updatedApplication;
  }

  async submitTask(taskId: string, studentId: string, data: SubmitTaskInput) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.status !== TaskStatus.IN_PROGRESS) {
      throw new Error('Cannot submit for this task');
    }

    // Check if student is the accepted applicant
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
        description: data.description,
        submissionUrls: data.submissionUrls,
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: TaskStatus.SUBMITTED,
      },
    });

    return submission;
  }

  async approveSubmission(taskId: string, organizationId: string, reviewNotes?: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        organizationId,
      },
      include: {
        submission: true,
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

    return task;
  }
}

export const taskService = new TaskService();

