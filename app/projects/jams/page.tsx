"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Jam } from "@/types/jam-log";
import { useLocalStorageState } from "@/lib/hooks/useLocalStorageState";
import { JamList } from "@/components/jams/JamList";
import { JamForm } from "@/components/jams/JamForm";
import { RecommendedJams } from "@/components/jams/RecommendedJams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function sortJamsByDate(jams: Jam[]): Jam[] {
  return [...jams].sort((a, b) => {
    // Sort by endDate, then by creation order (id)
    const dateA = a.endDate || "";
    const dateB = b.endDate || "";
    if (dateA && dateB) {
      return dateB.localeCompare(dateA); // Newest first
    }
    if (dateA) return -1;
    if (dateB) return 1;
    return b.id.localeCompare(a.id); // Fallback to ID for consistent ordering
  });
}

export default function JamsPage() {
  const router = useRouter();
  const [jams, setJams] = useLocalStorageState<Jam[]>("godotRoadmap.jamLog.v1", []);
  const [editingJam, setEditingJam] = useState<Jam | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const sortedJams = useMemo(() => sortJamsByDate(jams), [jams]);

  const handleAdd = () => {
    setEditingJam(undefined);
    setShowForm(true);
  };

  const handleEdit = (jam: Jam) => {
    setEditingJam(jam);
    setShowForm(true);
  };

  const handleSave = (jamData: Omit<Jam, "id">) => {
    if (editingJam) {
      // Update existing jam
      setJams((prev) =>
        prev.map((jam) => (jam.id === editingJam.id ? { ...jamData, id: editingJam.id } : jam))
      );
    } else {
      // Add new jam
      setJams((prev) => [...prev, { ...jamData, id: generateId() }]);
    }
    setShowForm(false);
    setEditingJam(undefined);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJam(undefined);
  };

  const handleDelete = (id: string) => {
    setJams((prev) => prev.filter((jam) => jam.id !== id));
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-bold mb-2">Game Jam Log</h1>
        <p className="text-muted-foreground">
          Track the game jams you&apos;ve joined and reflect on what you learned.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={handleAdd} disabled={showForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Jam
        </Button>
      </div>

      {showForm && (
        <JamForm
          key={editingJam?.id || "new"}
          jam={editingJam}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <JamList
        jams={sortedJams}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingJamId={editingJam?.id}
      />

      <RecommendedJams defaultOpen={jams.length === 0} />
    </div>
  );
}
