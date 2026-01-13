"use client";

import { Jam } from "@/types/jam-log";
import { JamItem } from "./JamItem";

interface JamListProps {
  jams: Jam[];
  onEdit: (jam: Jam) => void;
  onDelete: (id: string) => void;
  editingJamId?: string;
}

export function JamList({ jams, onEdit, onDelete, editingJamId }: JamListProps) {
  // Filter out the jam being edited to avoid duplication
  const displayJams = editingJamId ? jams.filter((jam) => jam.id !== editingJamId) : jams;

  if (displayJams.length === 0 && jams.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">No jams yet.</p>
        <p className="text-sm">Add your first jam to get started!</p>
      </div>
    );
  }

  if (displayJams.length === 0) {
    // All jams are being edited, show empty state
    return null;
  }

  return (
    <div className="space-y-4">
      {displayJams.map((jam) => (
        <JamItem
          key={jam.id}
          jam={jam}
          onEdit={() => onEdit(jam)}
          onDelete={() => onDelete(jam.id)}
        />
      ))}
    </div>
  );
}
