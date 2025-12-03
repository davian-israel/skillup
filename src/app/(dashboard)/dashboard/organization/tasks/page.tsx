'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function OrganizationTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect() {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // Filter to show only this organization's tasks
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const orgId = user.organization?.id;
        
        if (orgId) {
          const orgTasks = data.data.tasks.filter((task: any) => task.organizationId === orgId);
          setTasks(orgTasks);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'SUBMITTED':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusLabel(status: string) {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Posted Tasks</h1>
          <p className="text-muted-foreground">
            Manage your tasks and review applications
          </p>
        </div>
        <Link href="/dashboard/organization/tasks/new">
          <Button>Create New Task</Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                You haven't posted any tasks yet.
              </p>
              <Link href="/dashboard/organization/tasks/new">
                <Button>Create Your First Task</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>{task.category}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {task.description.length > 150
                    ? task.description.substring(0, 150) + '...'
                    : task.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {task.skillsRequired.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {task.skillsRequired.length > 3 && (
                    <Badge variant="outline">
                      +{task.skillsRequired.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Compensation</p>
                    <p className="font-semibold">
                      {formatCurrency(Number(task.compensationAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-semibold">
                      {formatDate(task.deadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applications</p>
                    <p className="font-semibold">
                      {task._count?.applications || 0} applicants
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/student/tasks/${task.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  {task._count?.applications > 0 && (
                    <Button size="sm">
                      Review Applications ({task._count.applications})
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

