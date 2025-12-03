import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/task-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const task = await taskService.getTaskById(params.id);
    
    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: error.message || 'Task not found',
        },
      },
      { status: 404 }
    );
  }
}

