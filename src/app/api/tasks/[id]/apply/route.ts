import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/task-service';
import { applyForTaskSchema } from '@/lib/validations/task';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const POST = requireRole('STUDENT')(async (
  request: NextRequest,
  { params }: { params: { id: string } },
  user: any
) => {
  try {
    const body = await request.json();
    
    const validatedData = applyForTaskSchema.parse(body);
    
    // Get student ID
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'STUDENT_NOT_FOUND',
            message: 'Student profile not found',
          },
        },
        { status: 404 }
      );
    }

    const application = await taskService.applyForTask(
      params.id,
      student.id,
      validatedData
    );
    
    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'APPLICATION_FAILED',
          message: error.message || 'Failed to apply for task',
        },
      },
      { status: 400 }
    );
  }
});

