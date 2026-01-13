"use client";

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-20 py-12 text-foreground text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Branding + Socials */}
        <div className="flex flex-col gap-4 sm:-mt-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Godot_icon.svg.png"
              alt="Godot Roadmap logo"
              width={40}
              height={40}
              className="dark:invert"
            />
            <span className="text-xl font-bold">Godot Roadmap (Unofficial)</span>
          </Link>
          <div className="text-muted-foreground">
            A community-made learning roadmap for Godot Engine developers.
          </div>
          <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <p>Not affiliated with or endorsed by the Godot Foundation.</p>
          </div>
          <div className="flex gap-4 mt-2 text-muted-foreground">
            <Link
              href="https://github.com/adnjoo/godot-roadmap"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 hover:text-foreground transition" />
            </Link>
            <Link
              href="https://godotengine.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Godot Engine"
            >
              <Image
                src="/Godot_icon.svg.png"
                alt="Godot Engine"
                width={20}
                height={20}
                className="dark:invert hover:opacity-80 transition"
              />
            </Link>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <p className="font-semibold mb-3">Navigation</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/roadmap" className="hover:underline hover:text-foreground transition">
                Roadmap
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:underline hover:text-foreground transition">
                Projects
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Learn */}
        <div>
          <p className="font-semibold mb-3">Learn</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/resources" className="hover:underline hover:text-foreground transition">
                Resources
              </Link>
            </li>
            <li>
              <Link href="/glossary" className="hover:underline hover:text-foreground transition">
                Glossary
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Community */}
        <div>
          <p className="font-semibold mb-3">Community</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link
                href="https://github.com/adnjoo/godot-roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-foreground transition"
              >
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href="https://godotengine.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-foreground transition"
              >
                Godot Engine
              </Link>
            </li>
            <li>
              <Link
                href="https://www.reddit.com/r/godot/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-foreground transition"
              >
                r/godot
              </Link>
            </li>
          </ul>
        </div>
      </div>

    </footer>
  );
}
