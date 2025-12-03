import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth-service';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, password } = loginSchema.parse(body);
    
    const { user, token } = await authService.login(email, password);
    
    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message || 'Invalid credentials',
        },
      },
      { status: 401 }
    );
  }
}

