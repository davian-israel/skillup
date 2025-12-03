import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';
import { prisma } from '@/lib/prisma';

export interface AuthUser extends TokenPayload {
  status: string;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthUser | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user || (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION')) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const user = await authenticateRequest(request);

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'UNAUTHORIZED', 
            message: 'Authentication required' 
          } 
        },
        { status: 401 }
      );
    }

    return handler(request, context, user);
  };
}

export function requireRole(...roles: string[]) {
  return (handler: Function) => {
    return async (request: NextRequest, context: any) => {
      const user = await authenticateRequest(request);

      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'UNAUTHORIZED', 
              message: 'Authentication required' 
            } 
          },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'FORBIDDEN', 
              message: 'Insufficient permissions' 
            } 
          },
          { status: 403 }
        );
      }

      return handler(request, context, user);
    };
  };
}

