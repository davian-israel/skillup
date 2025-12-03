'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TASK_CATEGORIES, COMPENSATION_TYPES } from '@/lib/constants/categories';

const COMMON_SKILLS = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Social Media Management',
  'Digital Marketing',
  'Video Editing',
  'Data Entry',
  'Research',
  'Photography',
  'Translation',
];

export default function CreateTaskPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skillsRequired: [] as string[],
    compensationAmount: '',
    compensationType: 'Tuition',
    deadline: '',
    estimatedDuration: '',
    requirements: '',
    deliverables: '',
    maxApplicants: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSkillToggle(skill: string) {
    if (formData.skillsRequired.includes(skill)) {
      setFormData({
        ...formData,
        skillsRequired: formData.skillsRequired.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skill],
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (formData.skillsRequired.length === 0) {
      setError('Please select at least one required skill');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          compensationAmount: parseFloat(formData.compensationAmount),
          maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Publish the task immediately
        await fetch(`/api/tasks/${data.data.id}/publish`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        router.push('/dashboard/organization/tasks');
      } else {
        setError(data.error.message || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-muted-foreground">
            Post a task to connect with talented students
          </p>
        </div>
        <Link href="/dashboard/organization/tasks">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Provide clear information about the task to attract the right students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Build a Website for Youth Education Program"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                minLength={10}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                A clear, descriptive title (10-200 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe the task in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                minLength={50}
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {TASK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  placeholder="e.g., 2 weeks, 1 month"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills Required * (Select at least one)</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.skillsRequired.includes(skill) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                    {formData.skillsRequired.includes(skill) && ' ✓'}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Selected: {formData.skillsRequired.length} skill(s)
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="compensationAmount">Compensation Amount (GHS) *</Label>
                <Input
                  id="compensationAmount"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2000"
                  value={formData.compensationAmount}
                  onChange={(e) => setFormData({ ...formData, compensationAmount: e.target.value })}
                  required
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compensationType">Compensation Type *</Label>
                <select
                  id="compensationType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.compensationType}
                  onChange={(e) => setFormData({ ...formData, compensationType: e.target.value })}
                  required
                >
                  {COMPENSATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <textarea
                id="requirements"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="List the requirements and qualifications needed..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
                minLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Deliverables *</Label>
              <textarea
                id="deliverables"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="What should the student deliver upon completion?"
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                required
                minLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxApplicants">Maximum Applicants (Optional)</Label>
              <Input
                id="maxApplicants"
                type="number"
                placeholder="Leave empty for unlimited"
                value={formData.maxApplicants}
                onChange={(e) => setFormData({ ...formData, maxApplicants: e.target.value })}
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating & Publishing...' : 'Create & Publish Task'}
              </Button>
              <Link href="/dashboard/organization/tasks">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

