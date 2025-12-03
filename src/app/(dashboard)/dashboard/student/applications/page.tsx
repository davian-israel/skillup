'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING':
        return 'Under Review';
      case 'ACCEPTED':
        return 'Accepted';
      case 'REJECTED':
        return 'Not Selected';
      case 'WITHDRAWN':
        return 'Withdrawn';
      default:
        return status;
    }
  }

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your task applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                You haven't applied for any tasks yet.
              </p>
              <Link href="/dashboard/student/tasks">
                <Button>Browse Available Tasks</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{application.task.title}</CardTitle>
                    <CardDescription>
                      {application.task.organization.organizationName}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Compensation</p>
                    <p className="font-semibold">
                      {formatCurrency(Number(application.task.compensationAmount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-semibold">
                      {formatDate(application.appliedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Task Deadline</p>
                    <p className="font-semibold">
                      {formatDate(application.task.deadline)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Your Cover Letter:</p>
                  <p className="text-sm">
                    {application.coverLetter.length > 200
                      ? application.coverLetter.substring(0, 200) + '...'
                      : application.coverLetter}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/student/tasks/${application.taskId}`}>
                    <Button variant="outline" size="sm">
                      View Task Details
                    </Button>
                  </Link>
                  
                  {application.status === 'ACCEPTED' && (
                    <Button size="sm">
                      Submit Work
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

