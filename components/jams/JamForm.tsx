"use client";

import { useState, useEffect } from "react";
import { Jam } from "@/types/jam-log";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JamFormProps {
  jam?: Jam;
  onSave: (jam: Omit<Jam, "id">) => void;
  onCancel: () => void;
}

export function JamForm({ jam, onSave, onCancel }: JamFormProps) {
  const [name, setName] = useState(jam?.name || "");
  const [endDate, setEndDate] = useState(jam?.endDate || "");
  const [jamUrl, setJamUrl] = useState(jam?.jamUrl || "");
  const [notes, setNotes] = useState(jam?.notes || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (jam) {
      setName(jam.name || "");
      setEndDate(jam.endDate || "");
      setJamUrl(jam.jamUrl || "");
      setNotes(jam.notes || "");
    } else {
      // Reset form when adding new jam
      setName("");
      setEndDate("");
      setJamUrl("");
      setNotes("");
    }
    setError("");
  }, [jam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    onSave({
      name: name.trim(),
      endDate: endDate || undefined,
      jamUrl: jamUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{jam ? "Edit Jam" : "Add New Jam"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium mb-1 block">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ludum Dare 50"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="text-sm font-medium mb-1 block">
              Date
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="jamUrl" className="text-sm font-medium mb-1 block">
              Jam Page URL
            </label>
            <Input
              id="jamUrl"
              type="url"
              value={jamUrl}
              onChange={(e) => setJamUrl(e.target.value)}
              placeholder="https://ldjam.com/events/ludum-dare/50"
            />
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-medium mb-1 block">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn? What went well? What would you do differently?"
              rows={4}
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              )}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          <div className="flex gap-2">
            <Button type="submit">{jam ? "Save Changes" : "Add Jam"}</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
