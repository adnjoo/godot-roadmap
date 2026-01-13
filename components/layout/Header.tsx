"use client";

import Link from "next/link";
import Image from "next/image";
import { useRoadmap } from "@/lib/store/RoadmapContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
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
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const { resetProgress } = useRoadmap();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2 min-w-0 flex-shrink-0">
          <Image
            src="/Godot_icon.svg.png"
            alt="Godot Engine"
            width={24}
            height={24}
            className="h-6 w-6 flex-shrink-0"
          />
          <span className="text-xl font-bold hidden sm:inline">Godot Roadmap</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
          <Link href="/roadmap">
            <Button variant="ghost" size="sm" className="text-sm px-2 sm:px-3">
              Roadmap
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="text-sm px-2 sm:px-3">
              Projects
            </Button>
          </Link>
          <ModeToggle />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Reset progress" className="h-9 w-9">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your completed items, projects, and tutor messages. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetProgress} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>
    </header>
  );
}
