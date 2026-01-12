"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { ProjectCard } from "./ProjectCard";
import roadmapData from "@/data/roadmap.godot-2026.json";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProjectList() {
  const { completedProjects } = useRoadmap();

  const allProjects = roadmapData.projects;
  const completedProjectsList = allProjects.filter((project) =>
    completedProjects.has(project.id)
  );
  const remainingProjects = allProjects.filter(
    (project) => !completedProjects.has(project.id)
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Projects ({allProjects.length})</TabsTrigger>
        <TabsTrigger value="remaining">
          Remaining ({remainingProjects.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedProjectsList.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="remaining" className="mt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {remainingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {remainingProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            All projects completed! Great work!
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedProjectsList.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        {completedProjectsList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects completed yet. Start working on one!
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
