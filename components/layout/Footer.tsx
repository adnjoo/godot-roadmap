import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Godot Roadmap</span>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
            {/* Explore Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Explore</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  Roadmap
                </Link>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/glossary" className="hover:text-foreground transition-colors">
                  Glossary
                </Link>
                <Link href="/resources" className="hover:text-foreground transition-colors">
                  Resources
                </Link>
              </div>
            </div>

            {/* Learn Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Learn</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <Link href="/resources" className="hover:text-foreground transition-colors">
                  Learning Resources
                </Link>
                <Link href="/glossary" className="hover:text-foreground transition-colors">
                  Glossary
                </Link>
                <Link href="/roadmap" className="hover:text-foreground transition-colors">
                  Learning Path
                </Link>
              </div>
            </div>

            {/* Community Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">Community</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <a
                  href="https://github.com/adnjoo/godot-roadmap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://godotengine.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Godot Engine
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
