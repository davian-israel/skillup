import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Connect Your Skills with{' '}
              <span className="text-primary">Opportunity</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              SkillFundr connects financially constrained students with NGOs, startups, 
              and small businesses. Complete tasks in exchange for tuition support, 
              stipends, or scholarship contributions.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>For Students</CardTitle>
                  <CardDescription>
                    Showcase your skills and earn tuition support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Create your profile with skills and portfolio</li>
                    <li>✓ Browse and apply for tasks</li>
                    <li>✓ Submit your work for review</li>
                    <li>✓ Receive direct tuition payments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>For Organizations</CardTitle>
                  <CardDescription>
                    Access skilled talent while supporting education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Post tasks with compensation details</li>
                    <li>✓ Review and select applicants</li>
                    <li>✓ Funds held safely in escrow</li>
                    <li>✓ Rate and review students</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secure & Transparent</CardTitle>
                  <CardDescription>
                    Safe payments with escrow protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Payments held in secure escrow</li>
                    <li>✓ Released upon task completion</li>
                    <li>✓ Direct to institution payments</li>
                    <li>✓ Rating system for accountability</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join hundreds of students and organizations already using SkillFundr
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register?type=student">
                <Button size="lg">Register as Student</Button>
              </Link>
              <Link href="/register?type=organization">
                <Button size="lg" variant="outline">
                  Register as Organization
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SkillFundr. Empowering students in Ghana through skill-based opportunities.</p>
        </div>
      </footer>
    </div>
  );
}

