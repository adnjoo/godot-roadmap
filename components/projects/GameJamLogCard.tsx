"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useRouter } from "next/navigation";
import { useLocalStorageState } from "@/lib/hooks/useLocalStorageState";
import { Jam } from "@/types/jam-log";

export function GameJamLogCard() {
  const router = useRouter();
  const [jams] = useLocalStorageState<Jam[]>("godotRoadmap.jamLog.v1", []);

  const { count, lastJamName, lastJamStatus } = useMemo(() => {
    const count = jams.length;
    let lastJamName: string | null = null;
    let lastJamStatus: "submitted" | "in-progress" | "past" | null = null;

    if (count > 0) {
      // Find the most recent jam by endDate
      const sorted = [...jams].sort((a, b) => {
        const dateA = a.endDate || "";
        const dateB = b.endDate || "";
        return dateB.localeCompare(dateA); // Newest first
      });

      const mostRecent = sorted[0];
      lastJamName = mostRecent.name;

      // Determine status
      if (mostRecent.gameUrl) {
        lastJamStatus = "submitted";
      } else if (mostRecent.endDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(mostRecent.endDate);
        endDate.setHours(0, 0, 0, 0);

        if (endDate > today) {
          lastJamStatus = "in-progress";
        } else {
          lastJamStatus = "past";
        }
      }
    }

    return { count, lastJamName, lastJamStatus };
  }, [jams]);

  return (
    <div className="relative rounded-lg">
      <GlowingEffect disabled={false} proximity={50} spread={40} />
      <Card className="h-full flex flex-col relative hover:shadow-md transition-shadow">
        <CardHeader>
        <CardTitle className="font-semibold text-lg">Game Jam Log</CardTitle>
        <CardDescription>
          Track the game jams you&apos;ve joined and reflect on what you learned.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="text-sm">
          <div className="font-medium">
            {count} {count === 1 ? "jam" : "jams"} logged
          </div>
          <div className="text-muted-foreground">
            Last: {lastJamName || "—"}
          </div>
          {lastJamStatus && (
            <div className="mt-2">
              <Badge
                variant={
                  lastJamStatus === "submitted"
                    ? "default"
                    : lastJamStatus === "in-progress"
                    ? "secondary"
                    : "outline"
                }
                className={
                  lastJamStatus === "submitted"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                    : lastJamStatus === "in-progress"
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                    : "bg-muted text-muted-foreground"
                }
              >
                {lastJamStatus === "submitted"
                  ? "Submitted"
                  : lastJamStatus === "in-progress"
                  ? "In progress"
                  : "Past"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={() => router.push("/projects/jams")}
        >
          Open Jam Log
        </Button>
        <p className="text-xs text-muted-foreground text-center">Saved locally</p>
      </CardFooter>
      </Card>
    </div>
  );
}
