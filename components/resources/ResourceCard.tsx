import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  urlLabel?: string;
  ariaLabel?: string;
}

export function ResourceCard({
  title,
  description,
  url,
  urlLabel,
  ariaLabel,
}: ResourceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-2"
            aria-label={ariaLabel || `${title} - Opens in new tab`}
          >
            {title}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {urlLabel && (
        <CardContent>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Visit ${title} - Opens in new tab`}
          >
            {urlLabel}
          </a>
        </CardContent>
      )}
    </Card>
  );
}
