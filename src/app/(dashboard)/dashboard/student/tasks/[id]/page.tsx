'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedTimeline, setProposedTimeline] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTask();
  }, [params.id]);

  async function fetchTask() {
    try {
      const response = await fetch(`/api/tasks/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setTask(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch task:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setApplying(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${params.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          coverLetter,
          proposedTimeline,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Application submitted successfully!');
        setShowApplyForm(false);
        setTimeout(() => {
          router.push('/dashboard/student/applications');
        }, 2000);
      } else {
        setError(data.error.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return <div>Loading task details...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/student/tasks">
          <Button variant="outline">← Back to Tasks</Button>
        </Link>
      </div>

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{task.title}</CardTitle>
              <CardDescription className="text-base">
                Posted by {task.organization.user.firstName} {task.organization.user.lastName}
                {' • '}
                {task.organization.organizationName}
              </CardDescription>
            </div>
            <Badge className="text-sm">{task.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Compensation</h3>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(Number(task.compensationAmount))}
              </p>
              <p className="text-sm text-muted-foreground">{task.compensationType}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Deadline</h3>
              <p className="text-lg">{formatDate(task.deadline)}</p>
              {task.estimatedDuration && (
                <p className="text-sm text-muted-foreground">
                  Estimated: {task.estimatedDuration}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {task.skillsRequired.map((skill: string) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Requirements</h3>
            <p className="text-muted-foreground">{task.requirements}</p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">Deliverables</h3>
            <p className="text-muted-foreground">{task.deliverables}</p>
          </div>

          {task._count && (
            <div>
              <p className="text-sm text-muted-foreground">
                {task._count.applications} student(s) have applied for this task
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {!showApplyForm ? (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => setShowApplyForm(true)} 
              className="w-full"
              size="lg"
            >
              Apply for This Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Application</CardTitle>
            <CardDescription>
              Tell the organization why you're the best fit for this task
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApply} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter *</Label>
                <textarea
                  id="coverLetter"
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Explain why you're a great fit for this task, your relevant experience, and how you plan to approach this project..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  minLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 100 characters. Currently: {coverLetter.length}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposedTimeline">Proposed Timeline (Optional)</Label>
                <textarea
                  id="proposedTimeline"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe your proposed timeline and approach to completing this task..."
                  value={proposedTimeline}
                  onChange={(e) => setProposedTimeline(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplyForm(false)}
                  disabled={applying}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

