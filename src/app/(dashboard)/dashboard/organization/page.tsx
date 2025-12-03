'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrganizationDashboard() {
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
          Manage your tasks and find talented students
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
            <CardDescription>
              Post a new task for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/organization/tasks/new">
              <Button className="w-full">Create New Task</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              Manage your posted tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/organization/tasks">
              <Button className="w-full" variant="outline">
                View Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Update organization details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/organization/profile">
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
            <li>1. Create a task with clear requirements</li>
            <li>2. Set compensation amount and type</li>
            <li>3. Review applications from students</li>
            <li>4. Accept an applicant and fund the task</li>
            <li>5. Review submission and release payment</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

