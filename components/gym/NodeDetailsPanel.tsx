"use client";

import { useGym } from "@/lib/store/GymContext";
import { gymNodes, type GymNode } from "@/data/godotGym";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NodeDetailsPanelProps {
  node: GymNode | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const TIER_COLORS = {
  1: "bg-green-500/20 text-green-400 border-green-500",
  2: "bg-blue-500/20 text-blue-400 border-blue-500",
  3: "bg-purple-500/20 text-purple-400 border-purple-500",
  4: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
  5: "bg-red-500/20 text-red-400 border-red-500",
};

export function NodeDetailsPanel({ node, isOpen, onClose, isMobile }: NodeDetailsPanelProps) {
  const { isNodeCompleted, toggleNode, isNodeUnlocked } = useGym();

  if (!node) return null;

  const completed = isNodeCompleted(node.id);
  const unlocked = isNodeUnlocked(node.id);

  const estHoursText = Array.isArray(node.estHours)
    ? `${node.estHours[0]}-${node.estHours[1]} hours`
    : `${node.estHours} hour${node.estHours !== 1 ? "s" : ""}`;

  const content = (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={cn("border", TIER_COLORS[node.tier])}>
              Tier {node.tier}
            </Badge>
            <Badge variant="outline">{node.category}</Badge>
          </div>
          <h2 className="text-xl font-bold text-stone-100 mb-2">{node.title}</h2>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-300 mb-1">Goal</h3>
        <p className="text-sm text-stone-400">{node.goal}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-300 mb-1">Teaches</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-stone-400">
          {node.teaches.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-300 mb-1">Estimated Time</h3>
        <p className="text-sm text-stone-400">{estHoursText}</p>
      </div>

      {node.prereqIds.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-stone-300 mb-1">Prerequisites</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-stone-400">
            {node.prereqIds.map((prereqId) => {
              const prereq = gymNodes.find((n) => n.id === prereqId);
              return (
                <li key={prereqId}>
                  {prereq ? prereq.title : prereqId}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="pt-4 border-t border-stone-700">
        {unlocked ? (
          <Button
            onClick={() => {
              toggleNode(node.id);
            }}
            className={cn(
              "w-full",
              completed ? "bg-green-600 hover:bg-green-700" : "bg-stone-700 hover:bg-stone-600"
            )}
          >
            {completed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Mark Incomplete
              </>
            ) : (
              "Mark Complete"
            )}
          </Button>
        ) : (
          <div className="text-sm text-stone-500 text-center py-2">
            Complete prerequisites to unlock
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-md bg-stone-900 border-stone-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">Node Details</AlertDialogTitle>
          </AlertDialogHeader>
          {content}
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full w-80 bg-stone-900/95 backdrop-blur-sm border-l border-stone-700 z-20 transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="h-full overflow-y-auto p-6">{content}</div>
    </div>
  );
}
