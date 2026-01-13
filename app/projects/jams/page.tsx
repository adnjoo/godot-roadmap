"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Jam } from "@/types/jam-log";
import { useLocalStorageState } from "@/lib/hooks/useLocalStorageState";
import { JamList } from "@/components/jams/JamList";
import { JamForm } from "@/components/jams/JamForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [importError, setImportError] = useState("");

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

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(jams, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `game-jam-log-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export jam log:", error);
      alert("Failed to export jam log. Please try again.");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = JSON.parse(text);

        if (!Array.isArray(imported)) {
          setImportError("Invalid file format. Expected an array of jams.");
          return;
        }

        // Validate structure
        const validJams = imported.filter((jam: any) => {
          return (
            typeof jam === "object" &&
            jam !== null &&
            typeof jam.id === "string" &&
            typeof jam.name === "string" &&
            jam.name.trim() !== ""
          );
        });

        if (validJams.length === 0) {
          setImportError("No valid jams found in file.");
          return;
        }

        // Merge with existing jams (avoid duplicates by ID)
        setJams((prev) => {
          const existingIds = new Set(prev.map((j) => j.id));
          const newJams = validJams.filter((j: Jam) => !existingIds.has(j.id));
          return [...prev, ...newJams];
        });

        setImportError("");
        alert(`Successfully imported ${validJams.length} jam(s).`);
        e.target.value = ""; // Reset input
      } catch (error) {
        console.error("Failed to import jam log:", error);
        setImportError("Failed to parse JSON file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportPaste = () => {
    const paste = prompt("Paste your JSON data here:");
    if (!paste) return;

    try {
      const imported = JSON.parse(paste);

      if (!Array.isArray(imported)) {
        setImportError("Invalid format. Expected an array of jams.");
        return;
      }

      // Validate structure
      const validJams = imported.filter((jam: any) => {
        return (
          typeof jam === "object" &&
          jam !== null &&
          typeof jam.id === "string" &&
          typeof jam.name === "string" &&
          jam.name.trim() !== ""
        );
      });

      if (validJams.length === 0) {
        setImportError("No valid jams found in pasted data.");
        return;
      }

      // Merge with existing jams (avoid duplicates by ID)
      setJams((prev) => {
        const existingIds = new Set(prev.map((j) => j.id));
        const newJams = validJams.filter((j: Jam) => !existingIds.has(j.id));
        return [...prev, ...newJams];
      });

      setImportError("");
      alert(`Successfully imported ${validJams.length} jam(s).`);
    } catch (error) {
      console.error("Failed to import jam log:", error);
      setImportError("Failed to parse JSON. Please check the format.");
    }
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
        <Button variant="outline" onClick={handleExport} disabled={jams.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <Button variant="outline" asChild>
            <label htmlFor="import-file" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </label>
          </Button>
          <Button variant="outline" onClick={handleImportPaste}>
            <Upload className="h-4 w-4 mr-2" />
            Paste JSON
          </Button>
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {importError}
        </div>
      )}

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
    </div>
  );
}
