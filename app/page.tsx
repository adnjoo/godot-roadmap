import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Map, FolderKanban, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center text-center space-y-8 mb-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Godot Game Developer
          </h1>
          <h2 className="text-2xl font-semibold text-muted-foreground sm:text-3xl">
            Roadmap (2026)
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            A comprehensive, step-by-step guide to mastering Godot game development. Track your
            progress, build projects, and learn at your own pace.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/roadmap">Open Roadmap</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">View Projects</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Map className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Roadmap</CardTitle>
            <CardDescription>
              Interactive learning path with 60+ topics covering everything from foundations to
              advanced techniques.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/roadmap">Explore Roadmap</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FolderKanban className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Practice projects mapped to roadmap milestones. Build real games while you learn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/projects">View Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Guides</CardTitle>
            <CardDescription>
              In-depth guides and tutorials for specific topics. Coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <HelpCircle className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>FAQ</CardTitle>
            <CardDescription>
              Frequently asked questions about the roadmap and learning path. Coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
