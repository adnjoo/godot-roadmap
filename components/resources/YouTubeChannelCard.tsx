import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface YouTubeChannelCardProps {
  name: string;
  url: string;
  description: string;
}

export function YouTubeChannelCard({ name, url, description }: YouTubeChannelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-2"
            aria-label={`${name} YouTube channel - Opens in new tab`}
          >
            {name}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
