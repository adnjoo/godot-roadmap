"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLocalStorageState } from "@/lib/hooks/useLocalStorageState";
import { Jam } from "@/types/jam-log";

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function GameJamLogCard() {
  const router = useRouter();
  const [jams] = useLocalStorageState<Jam[]>("godotRoadmap.jamLog.v1", []);

  const { count, lastJamName, lastJamDate } = useMemo(() => {
    const count = jams.length;
    let lastJamName: string | null = null;
    let lastJamDate: string | null = null;

    if (count > 0) {
      // Find the most recent jam by endDate
      const sorted = [...jams].sort((a, b) => {
        const dateA = a.endDate || "";
        const dateB = b.endDate || "";
        return dateB.localeCompare(dateA); // Newest first
      });

      const mostRecent = sorted[0];
      lastJamName = mostRecent.name;
      if (mostRecent.endDate) {
        lastJamDate = formatDate(mostRecent.endDate);
      }
    }

    return { count, lastJamName, lastJamDate };
  }, [jams]);

  return (
    <Card
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push("/projects/jams")}
    >
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
          {lastJamDate && (
            <div className="text-muted-foreground">
              Due: {lastJamDate}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
