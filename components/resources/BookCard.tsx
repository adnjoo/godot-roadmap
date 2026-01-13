import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface BookCardProps {
  title: string;
  author?: string;
  authors?: string;
  url?: string;
  whatItTeaches: string;
  whyItMatters: string;
  greatFor: string;
}

export function BookCard({
  title,
  author,
  authors,
  url,
  whatItTeaches,
  whyItMatters,
  greatFor,
}: BookCardProps) {
  const titleElement = url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition-colors flex items-center gap-2"
      aria-label={`${title} - Opens in new tab`}
    >
      {title}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  ) : (
    title
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className={url ? "flex items-center gap-2" : ""}>{titleElement}</CardTitle>
        <CardDescription className="space-y-2">
          {(author || authors) && (
            <div>
              <strong>{author ? "Author" : "Authors"}:</strong> {author || authors}
            </div>
          )}
          <div>
            <strong>What it teaches:</strong> {whatItTeaches}
          </div>
          <div>
            <strong>Why it matters:</strong> {whyItMatters}
          </div>
          <div className="text-sm text-muted-foreground italic">Great for: {greatFor}</div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
