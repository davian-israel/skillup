import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/task-service';
import { createTaskSchema } from '@/lib/validations/task';
import { requireRole } from '@/lib/auth/middleware';
import { prisma } from '@/lib/prisma';

// GET /api/tasks - List all available tasks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const filters = {
      category: searchParams.get('category') || undefined,
      skills: searchParams.get('skills') || undefined,
      minCompensation: searchParams.get('minCompensation') 
        ? Number(searchParams.get('minCompensation')) 
        : undefined,
      maxCompensation: searchParams.get('maxCompensation') 
        ? Number(searchParams.get('maxCompensation')) 
        : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      search: searchParams.get('search') || undefined,
    };

    const result = await taskService.getAvailableTasks(filters);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error.message || 'Failed to fetch tasks',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task (Organization only)
export const POST = requireRole('ORGANIZATION')(async (
  request: NextRequest, 
  context: any, 
  user: any
) => {
  try {
    const body = await request.json();
    
    const validatedData = createTaskSchema.parse(body);
    
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

    const task = await taskService.createTask(organization.id, validatedData);
    
    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: error.message || 'Failed to create task',
        },
      },
      { status: 400 }
    );
  }
});

