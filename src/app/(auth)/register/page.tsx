import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Join SkillFundr</h1>
        <p className="text-muted-foreground">Choose your account type to get started</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Account</CardTitle>
            <CardDescription>
              Showcase your skills and find opportunities to fund your education
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 space-y-2 text-sm">
              <li>✓ Create your profile</li>
              <li>✓ Browse available tasks</li>
              <li>✓ Apply and complete work</li>
              <li>✓ Receive tuition support</li>
            </ul>
            <Link href="/register/student">
              <Button className="w-full">Register as Student</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Account</CardTitle>
            <CardDescription>
              Post tasks and access skilled students while supporting education
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 space-y-2 text-sm">
              <li>✓ Post tasks with budgets</li>
              <li>✓ Review applications</li>
              <li>✓ Secure escrow payments</li>
              <li>✓ Rate and review students</li>
            </ul>
            <Link href="/register/organization">
              <Button className="w-full" variant="outline">
                Register as Organization
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
}

