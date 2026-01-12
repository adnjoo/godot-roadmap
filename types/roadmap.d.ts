export interface RoadmapSection {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  sectionId: string;
  title: string;
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "2D" | "3D" | "UI" | "Systems" | "Tools";
  estHours: number;
  prerequisites: string[];
  resources: Array<{ label: string; url: string }>;
  keywords: string[];
}

export interface RoadmapProject {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  checklist: string[];
  scope: string;
}

export interface RoadmapData {
  sections: RoadmapSection[];
  items: RoadmapItem[];
  projects: RoadmapProject[];
}
