import { ProjectList } from "@/components/projects/ProjectList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Projects</h1>
        <p className="text-muted-foreground">
          Build real games while learning. Each project is mapped to specific roadmap milestones
          and includes a checklist to guide your development.
        </p>
      </div>
      <ProjectList />
    </div>
  );
}
