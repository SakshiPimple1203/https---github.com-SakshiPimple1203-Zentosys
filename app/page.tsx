import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Layout, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Layout className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TaskBoard</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24 lg:py-32 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Organize your projects with ease
          </h1>
          <p className="text-xl text-muted-foreground">
            A simple, flexible, and powerful way to manage your tasks and collaborate with your team.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
              alt="Project management illustration" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Features that empower your workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Boards</h3>
              <p className="text-muted-foreground">Create and customize boards for any project, big or small.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Task Management</h3>
              <p className="text-muted-foreground">Drag and drop tasks between lists to update status with ease.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">Assign tasks, track progress, and collaborate with your team in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 md:py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to get organized?</h2>
          <p className="text-xl text-muted-foreground">
            Sign up for free and start managing your projects today.
          </p>
          <Link href="/register">
            <Button size="lg" className="mt-4">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted mt-auto">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <span className="font-semibold">TaskBoard</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskBoard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}