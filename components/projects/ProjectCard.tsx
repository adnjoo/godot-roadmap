"use client";

import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import roadmapData from "@/data/roadmap.godot-2026.json";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  checklist: string[];
  scope: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { completedProjects, completedItems, toggleProject } = useRoadmap();
  const isCompleted = completedProjects.has(project.id);

  // Check prerequisites
  const prerequisitesMet = project.prerequisites.every((prereq) =>
    completedItems.has(prereq)
  );
  const prerequisitesCount = project.prerequisites.length;
  const prerequisitesCompleted = project.prerequisites.filter((prereq) =>
    completedItems.has(prereq)
  ).length;

  // Get prerequisite item titles
  const getPrerequisiteTitles = () => {
    return project.prerequisites
      .map((id) => roadmapData.items.find((item) => item.id === id)?.title)
      .filter(Boolean);
  };

  return (
    <Card className={cn("h-full flex flex-col", isCompleted && "opacity-75 border-primary/50")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("font-semibold text-lg", isCompleted && "line-through")}>
                {project.title}
              </h3>
              {isCompleted && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Prerequisites</div>
          {prerequisitesCount > 0 ? (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                {prerequisitesCompleted} of {prerequisitesCount} completed
              </div>
              {!prerequisitesMet && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  Complete prerequisites to start this project
                </div>
              )}
              <Accordion type="single" collapsible>
                <AccordionItem value="prereqs" className="border-none">
                  <AccordionTrigger className="text-xs py-1">
                    View prerequisites ({prerequisitesCount})
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-1 text-xs">
                      {getPrerequisiteTitles().map((title, idx) => {
                        const prereqId = project.prerequisites[idx];
                        const isDone = completedItems.has(prereqId);
                        return (
                          <li key={prereqId} className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            ) : (
                              <Circle className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className={cn(!isDone && "text-muted-foreground")}>{title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No prerequisites</div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Project Checklist</div>
          <ul className="space-y-1.5">
            {project.checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Circle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground">Scope: {project.scope}</div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant={isCompleted ? "outline" : "default"}
          className="flex-1"
          onClick={() => toggleProject(project.id)}
        >
          {isCompleted ? "Mark Incomplete" : "Mark Complete"}
        </Button>
        {prerequisitesMet && (
          <Button variant="secondary" asChild>
            <Link href="/roadmap">
              Start Project
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
