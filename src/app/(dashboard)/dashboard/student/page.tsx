'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
        <p className="text-muted-foreground">
          Start browsing tasks to find opportunities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Browse Tasks</CardTitle>
            <CardDescription>
              Find tasks that match your skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/student/tasks">
              <Button className="w-full">View Tasks</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
            <CardDescription>
              Track your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/student/applications">
              <Button className="w-full" variant="outline">
                View Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Update your skills and portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/student/profile">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li>1. Complete your profile and add your skills</li>
            <li>2. Browse available tasks</li>
            <li>3. Apply for tasks that match your skills</li>
            <li>4. Submit your work when accepted</li>
            <li>5. Receive tuition support upon completion</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

