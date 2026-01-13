"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

interface RecommendedJam {
  name: string;
  description: string;
  url: string;
}

const recommendedJams: RecommendedJam[] = [
  {
    name: "Godot Wild Jam",
    description: "Monthly, Godot-only, friendly community",
    url: "https://godotwildjam.com/",
  },
  {
    name: "Mini Jam",
    description: "Great for scoping small games",
    url: "https://minijamofficial.com/",
  },
  {
    name: "Ludum Dare",
    description: "Big event, more intense",
    url: "https://ldjam.com",
  },
  {
    name: "GMTK Game Jam",
    description: "Design-focused, fun constraints",
    url: "https://gamemakerstoolkit.com/jam/",
  },
];

interface RecommendedJamsProps {
  defaultOpen?: boolean;
}

export function RecommendedJams({ defaultOpen = true }: RecommendedJamsProps) {
  return (
    <Card className="mt-8">
      <Accordion type="single" collapsible defaultValue={defaultOpen ? "recommended-jams" : undefined}>
        <AccordionItem value="recommended-jams" className="border-none">
          <CardHeader className="pb-3">
            <AccordionTrigger className="hover:no-underline py-0">
              <CardTitle className="text-xl">New to jams? Start here</CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="space-y-4 pt-0">
              <p className="text-sm text-muted-foreground">
                Pick one. Don&apos;t overthink it. Shipping anything is a win.
              </p>
              <div className="space-y-3">
                {recommendedJams.map((jam) => (
                  <div
                    key={jam.name}
                    className="flex items-start justify-between gap-4 pb-3 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{jam.name}</h4>
                      <p className="text-sm text-muted-foreground">{jam.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={jam.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        Visit
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
