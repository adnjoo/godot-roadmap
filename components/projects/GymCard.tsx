"use client";

import { useGym } from "@/lib/store/GymContext";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function GymCard() {
  const { getCompletedCount } = useGym();
  const completed = getCompletedCount();

  return (
    <div className="relative rounded-lg">
      <GlowingEffect disabled={false} proximity={50} spread={40} />
      <Card className="h-full flex flex-col relative border-cyan-500/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">Godot Gym (100 Projects)</h3>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400">
                  Gym Mode
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Master Godot through 100 hands-on projects organized in a radial skill tree. 
                Progress through 5 tiers from basics to advanced systems.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Progress</div>
            <div className="text-xs text-muted-foreground">
              {completed} of 100 projects completed
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${(completed / 100) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="flex-1" asChild>
            <Link href="/projects/gym">
              Enter Gym Mode
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
