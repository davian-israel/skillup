import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth-service';
import { studentRegisterSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = studentRegisterSchema.parse(body);
    
    const { user, token } = await authService.registerStudent(validatedData);
    
    return NextResponse.json({
      success: true,
      data: { user, token },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Registration failed',
        },
      },
      { status: 400 }
    );
  }
}

