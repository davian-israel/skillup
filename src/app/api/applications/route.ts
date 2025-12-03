import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/task-service';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const GET = requireRole('STUDENT')(async (
  request: NextRequest,
  context: any,
  user: any
) => {
  try {
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

    const applications = await taskService.getStudentApplications(student.id);
    
    return NextResponse.json({
      success: true,
      data: applications,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error.message || 'Failed to fetch applications',
        },
      },
      { status: 500 }
    );
  }
});

