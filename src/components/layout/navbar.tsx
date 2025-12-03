'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'ORGANIZATION';
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }

  const dashboardPath = user?.role === 'STUDENT' 
    ? '/dashboard/student' 
    : '/dashboard/organization';

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            SkillFundr
          </Link>
          
          {!isAuthPage && (
            <nav className="hidden items-center gap-4 md:flex">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              {user && (
                <Link 
                  href={dashboardPath}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isDashboardPage ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {user?.role === 'STUDENT' && (
                <Link 
                  href="/dashboard/student/tasks"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes('/tasks') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Browse Tasks
                </Link>
              )}
              {user?.role === 'ORGANIZATION' && (
                <Link 
                  href="/dashboard/organization/tasks"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname.includes('/tasks') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Tasks
                </Link>
              )}
            </nav>
          )}
        </div>

        <nav className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              <span className="hidden text-sm text-muted-foreground md:block">
                {user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

