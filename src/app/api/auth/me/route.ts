import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth-service';
import { requireAuth } from '@/lib/auth/middleware';

export const GET = requireAuth(async (request: NextRequest, context: any, user: any) => {
  try {
    const currentUser = await authService.getCurrentUser(user.id);
    
    return NextResponse.json({
      success: true,
      data: currentUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message || 'User not found',
        },
      },
      { status: 404 }
    );
  }
});

