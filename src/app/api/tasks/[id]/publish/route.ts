import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/task-service';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

export const POST = requireRole('ORGANIZATION')(async (
  request: NextRequest,
  { params }: { params: { id: string } },
  user: any
) => {
  try {
    // Get organization ID
    const organization = await prisma.organization.findUnique({
      where: { userId: user.id },
    });

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORGANIZATION_NOT_FOUND',
            message: 'Organization profile not found',
          },
        },
        { status: 404 }
      );
    }

    const task = await taskService.publishTask(params.id, organization.id);
    
    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PUBLISH_FAILED',
          message: error.message || 'Failed to publish task',
        },
      },
      { status: 400 }
    );
  }
});

