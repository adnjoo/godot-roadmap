"use client";

import { Jam } from "@/types/jam-log";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExternalLink, Edit, Trash2 } from "lucide-react";

interface JamItemProps {
  jam: Jam;
  onEdit: () => void;
  onDelete: () => void;
}

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

export function JamItem({ jam, onEdit, onDelete }: JamItemProps) {
  const dateStr = jam.endDate ? formatDate(jam.endDate) : "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{jam.name}</h3>
            {dateStr && (
              <p className="text-sm text-muted-foreground">{dateStr}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Jam</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{jam.name}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {jam.jamUrl && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={jam.jamUrl} target="_blank" rel="noopener noreferrer">
                Jam Page
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        )}
        {jam.notes && (
          <div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{jam.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
